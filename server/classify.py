"""
classify_clip.py  —  OpenAI CLIP with custom domain labels

FIXES from previous version:
1.  "Not enough disk space" — Added disk space check before loading.
    Clear space: delete C:\\Users\\<you>\\.cache\\huggingface\\hub if needed.
2.  Same GridFS "Image not found" fix as EfficientNet version.
3.  Model loads from local cache if already downloaded (no re-download).

INSTALL:
    pip install transformers torch torchvision

DISK SPACE REQUIRED: ~700MB for the CLIP model (one-time download).
If you are low on disk, use classify_efficientnet.py instead — it only
needs the TensorFlow cache (~50MB for EfficientNetV2B0).

USAGE: rename to classify.py to activate.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from bson import ObjectId
import gridfs
from io import BytesIO
from PIL import Image
import torch
import os
import shutil
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5000"],
    allow_credentials=True, allow_methods=["*"], allow_headers=["*"],
)

MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    raise Exception("MONGO_URI not found in .env")

client         = MongoClient(MONGO_URI)
db             = client["snapalyze"]
fs             = gridfs.GridFS(db, collection="images")
zip_collection = db["zips"]

# ── Check disk space before loading model ────────────────────────────────────
cache_dir     = os.path.expanduser("~/.cache/huggingface/hub")
free_gb       = shutil.disk_usage(cache_dir if os.path.exists(cache_dir) else ".").free / (1024**3)
REQUIRED_GB   = 0.8   # 800MB needed for CLIP

if free_gb < REQUIRED_GB:
    print(f"⚠️  WARNING: Only {free_gb:.1f}GB free disk space.")
    print(f"   CLIP needs ~{REQUIRED_GB}GB. Consider:")
    print(f"   1. Deleting old cache: {cache_dir}")
    print(f"   2. Using classify_efficientnet.py instead (needs only ~50MB)")

# ── Load CLIP ────────────────────────────────────────────────────────────────
from transformers import CLIPProcessor, CLIPModel

print("Loading CLIP (openai/clip-vit-base-patch32)...")
clip_model     = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
clip_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
clip_model.eval()
print("CLIP loaded ✓")

# ── Custom labels — edit these to match your use case ────────────────────────
CUSTOM_LABELS = [
    # Documents & bills
    "electricity bill", "water bill", "bank statement",
    "invoice or receipt", "ID card or identity document",
    "passport", "driving licence", "government document",
    "handwritten letter", "printed document or form",
    # Vehicles
    "car or automobile", "motorcycle or bike",
    "number plate or license plate", "truck or lorry", "bus",
    # Products
    "product label or packaging", "printed t-shirt or clothing",
    "book cover", "poster or advertisement", "food or drink item",
    # Places
    "street or road scene", "building or architecture",
    "shop or store", "natural landscape",
    # Text-heavy
    "newspaper or magazine", "menu or food list",
    "signboard or hoarding", "whiteboard or blackboard",
    "chart or graph", "screenshot of software or website",
    # General
    "person or people", "animal", "logo or symbol",
    "photograph", "artwork or illustration",
]

CONFIDENCE_THRESHOLD = 0.04


def find_gridfs_file(filename: str):
    """Robust 3-step GridFS lookup — handles full path vs basename mismatch."""
    f = fs.find_one({"filename": filename})
    if f:
        return f
    basename = filename.replace("\\", "/").split("/")[-1]
    if basename != filename:
        f = fs.find_one({"filename": basename})
        if f:
            return f
    cursor = fs.find({"filename": {"$regex": f"(^|[\\/]){basename}$"}})
    files  = list(cursor)
    return files[0] if files else None


def classify_with_clip(image_bytes: bytes) -> list:
    img     = Image.open(BytesIO(image_bytes)).convert("RGB")
    prompts = [f"a photo of a {label}" for label in CUSTOM_LABELS]
    with torch.no_grad():
        inputs = clip_processor(
            text=prompts, images=img,
            return_tensors="pt", padding=True, truncation=True,
        )
        probs = clip_model(**inputs).logits_per_image.softmax(dim=1)[0]
    top3 = []
    for idx in probs.argsort(descending=True):
        conf = float(probs[idx])
        if conf >= CONFIDENCE_THRESHOLD:
            top3.append({"label": CUSTOM_LABELS[idx], "confidence": round(conf, 4)})
        if len(top3) == 3:
            break
    return top3


@app.get("/api/zip/classify/{zip_id}")
async def classify_images(zip_id: str):
    try:
        zip_doc = zip_collection.find_one({"_id": ObjectId(zip_id)})
        if not zip_doc:
            raise HTTPException(status_code=404, detail="ZIP not found")

        results = []
        for img_meta in zip_doc.get("images", []):
            filename = img_meta.get("filename")
            file     = find_gridfs_file(filename)
            if not file:
                results.append({"filename": filename, "predictions": [],
                                 "error": f"Image not found: {filename}"})
                continue
            try:
                predictions = classify_with_clip(file.read())
                results.append({"filename": filename, "predictions": predictions, "model": "CLIP ViT-B/32"})
            except Exception as e:
                results.append({"filename": filename, "predictions": [], "error": str(e)})

        return {"zipId": zip_id, "results": results}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
async def health():
    return {"status": "ok", "model": "CLIP ViT-B/32", "labels": len(CUSTOM_LABELS)}