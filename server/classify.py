from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from pymongo import MongoClient
from bson import ObjectId
import gridfs
from io import BytesIO
from PIL import Image
import numpy as np
import tensorflow as tf
import os
from fastapi.middleware.cors import CORSMiddleware

# Existing FastAPI app
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# MongoDB connection string (set your real URI in environment variables)
MONGO_URI = os.getenv("MONGO_URI", "your-mongodb-uri")
client = MongoClient(MONGO_URI)
db = client['snapalyze']
fs = gridfs.GridFS(db, collection='images')
zip_collection = db['zips']

# Load MobileNetV2 pretrained on ImageNet
mobilenet = tf.keras.applications.MobileNetV2(weights='imagenet')

def preprocess_image(image_bytes):
    img = Image.open(BytesIO(image_bytes)).convert('RGB')
    img = img.resize((224, 224))
    img_array = tf.keras.preprocessing.image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    return tf.keras.applications.mobilenet_v2.preprocess_input(img_array)

@app.get("/api/zip/classify/{zip_id}")
async def classify_images(zip_id: str):
    try:
        zip_doc = zip_collection.find_one({"_id": ObjectId(zip_id)})
        if not zip_doc:
            raise HTTPException(status_code=404, detail="ZIP not found")

        results = []

        for img_meta in zip_doc.get("images", []):
            filename = img_meta.get("filename")
            file = fs.find_one({"filename": filename})
            if not file:
                continue

            image_data = file.read()
            img_tensor = preprocess_image(image_data)
            preds = mobilenet.predict(img_tensor)
            decoded = tf.keras.applications.mobilenet_v2.decode_predictions(preds, top=3)[0]

            # Format top 3 predictions as list of {label, confidence}
            predictions = []
            for _, label, confidence in decoded:
                predictions.append({
                    "label": label,
                    "confidence": float(confidence)
                })

            results.append({
                "filename": filename,
                "predictions": predictions
            })

        return JSONResponse(content={"zipId": zip_id, "results": results})

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))