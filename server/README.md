# Snapalyze — Server

Two servers run side by side. Both must be running for the app to work.

| Server | Language | Port | Responsibility |
|---|---|---|---|
| Node.js / Express | JavaScript | 5000 | Auth, ZIP upload, OCR, routing |
| Python / FastAPI | Python | 8000 | CLIP image classification |

---

## Folder Structure

```
server/
├── controllers/
│   ├── zipController.js         # ZIP upload, OCR pipeline, analyze
│   ├── userController.js        # Register, login, all password features
│   └── dashboardController.js   # Dashboard data, delete single + all
├── routes/
│   ├── zipRoutes.js             # /api/zip/*
│   ├── userRoutes.js            # /api/users/*
│   └── dashboardRoutes.js       # /api/dashboard
├── models/
│   ├── userModel.js
│   └── zipModel.js
├── schemas/
│   ├── userSchema.js            # includes dailyUploadCount + lastUploadDate
│   └── zipSchema.js             # includes GridFS image references
├── middleware/
│   └── authMiddleware.js        # JWT verification on protected routes
├── config/
│   └── db.js                    # MongoDB Atlas connection
├── utils/
│   ├── emailUtils.js            # Nodemailer password reset emails
│   └── passwordUtils.js         # Password rules + SHA-256 token hashing
├── validations/
│   └── userValidation.js        # express-validator rules
├── classify.py                  # Python FastAPI AI server (CLIP)
├── requirements.txt             # Python dependencies
├── index.js                     # Express entry point
└── package.json
```

---

## Setup

### Node.js server

```bash
npm install
cp .env.example .env      # fill in all values
npm run dev               # development with nodemon
npm start                 # production
```

### Python AI server

```bash
python -m venv venv
venv\Scripts\activate       # Windows
source venv/bin/activate    # Mac / Linux

pip install -r requirements.txt
uvicorn classify:app --reload --port 8000
```

The first time you run the Python server, it downloads the CLIP model weights (~600MB) from HuggingFace. This is a one-time download. After that it loads from local cache in seconds.

---

## Environment Variables

```env
MONGO_URI=mongodb+srv://...
JWT_SECRET=your-long-random-secret
PORT=5000
CLIENT_URL=http://localhost:3000
PYTHON_API_URL=http://localhost:8000
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your-app-password
```

---

## Classification — How CLIP Works

### What CLIP is

CLIP (Contrastive Language-Image Pretraining) is a model published by OpenAI in 2021. It was trained on 400 million image-text pairs scraped from the internet. The core idea is that it learned to match images to their text descriptions — so it understands the relationship between visual content and language.

It uses **PyTorch and the HuggingFace `transformers` library.**

### Why CLIP instead of a standard classifier like ResNet or MobileNet

Standard image classifiers (ResNet, MobileNet, EfficientNet) are trained on ImageNet, which has 1000 fixed categories. When you give them a Maharashtra electricity bill, the closest category they know is `envelope` or `paper towel` — because they have never seen a bill. They cannot go outside their training categories.

CLIP works differently. Instead of predicting from a fixed list, you give it your own labels in plain English, and it scores each image against each label. So you can write `"electricity bill"` as a label and it actually knows what that means — because it has seen millions of images of bills paired with the text "electricity bill" during training.

This is called **zero-shot classification** — the model classifies images into categories it was never explicitly fine-tuned on.

### What the code does

In `classify.py`, 35 custom domain labels are defined covering the kinds of images Snapalyze users actually upload:

```python
CUSTOM_LABELS = [
    "electricity bill", "water bill", "bank statement",
    "invoice or receipt", "ID card or identity document",
    "number plate or license plate", "driving licence",
    "printed t-shirt or clothing", "book cover",
    "newspaper or magazine", "menu or food list",
    "signboard or hoarding", "screenshot of software or website",
    # ... and 22 more
]
```

For each image, the code:

1. Opens the image from MongoDB GridFS
2. Creates 35 text prompts in the format `"a photo of a {label}"` — this matches how CLIP was trained
3. Passes the image and all 35 prompts through CLIP simultaneously
4. CLIP computes a similarity score between the image and each prompt
5. Applies softmax to convert scores to probabilities
6. Returns the top 3 predictions above the 4% confidence threshold

```python
prompts = [f"a photo of a {label}" for label in CUSTOM_LABELS]
with torch.no_grad():
    inputs = clip_processor(text=prompts, images=img, return_tensors="pt", padding=True)
    probs  = clip_model(**inputs).logits_per_image.softmax(dim=1)[0]
```

### Accuracy vs traditional models

| Model | Approach | Real-world documents |
|---|---|---|
| MobileNetV2 | Fixed 1000 ImageNet categories | Guesses `envelope: 32%` for a bill |
| EfficientNetV2 | Fixed 1000 ImageNet categories | Slightly better guesses, still wrong categories |
| CLIP ViT-B/32 | Zero-shot with your own labels | `electricity bill: 87%` |

CLIP gives meaningful, human-readable results for the kinds of images your users actually upload.

### GridFS lookup

CLIP reads images directly from MongoDB GridFS — the same store where Node.js uploaded them. The `find_gridfs_file()` function does a 3-step lookup to handle cases where the filename is stored with a path prefix vs just a basename:

```python
def find_gridfs_file(filename):
    # 1. Exact match
    # 2. Basename match (strips directory prefix)
    # 3. Regex ends-with match (handles OS path separators)
```

---

## OCR Pipeline

```
Image buffer (from GridFS)
        │
        ▼
likelyHasText() — Sharp statistics check
  High entropy or vivid colors → skip (returns { skipped: true })
  Low entropy, muted colors   → continue to OCR
        │
        ▼
preprocessForOCR() — Sharp transformations
  1. Convert to grayscale
  2. Upscale to max 1000px width with Lanczos kernel
  3. Normalise contrast (stretch histogram)
  4. Sharpen edges
  5. Output as lossless PNG
        │
        ▼
Cached Tesseract worker (created once at startup, reused for all requests)
  Engine mode:       LSTM only (mode 1)
  Page segmentation: auto (mode 3)
  Character whitelist applied to reduce false positives
        │
        ▼
Post-processing
  Strip lines under 2 characters
  Remove lines under 30% alphanumeric content
  Collapse consecutive blank lines
        │
        ▼
{ text, confidence, wordCount, lineCount, duration, skipped }
```

---

## Auth & Password System

**Registration / Login**
- Passwords hashed with bcrypt (cost factor 10)
- JWT tokens expire after 24 hours
- Strong password rules enforced by `express-validator` on the server

**Forgot Password**
- `crypto.randomBytes(32)` generates a raw token
- Only the SHA-256 hash of that token is stored in the database
- The raw token goes in the email link — it cannot be reversed from the stored hash
- Token expires after 1 hour (`passwordResetExpires` field on user)

**Daily Upload Limits**
- Two fields on the user document: `dailyUploadCount` and `lastUploadDate`
- On every upload, today's UTC date string is compared to the stored date
- If different, `dailyUploadCount` resets to zero automatically
- No cron job or scheduled task needed

---

## Deployment

Node.js → **Render**. Python AI → **HuggingFace Spaces**.

**Render settings for Node.js:**
- Root directory: `server`
- Build command: `npm install`
- Start command: `npm start`
- Add all env vars in the Render dashboard

**HuggingFace Spaces settings for Python:**
- SDK: Docker
- Hardware: CPU Basic (free, 16GB RAM — enough for CLIP)
- Upload `classify.py`, `requirements.txt`, and a `Dockerfile`
- Add `MONGO_URI` as a Space secret