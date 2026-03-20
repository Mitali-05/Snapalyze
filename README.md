# Snapalyze — AI-Powered Image Analysis Platform

Upload a ZIP of images. Snapalyze classifies every image using OpenAI CLIP, extracts text with Tesseract OCR, and displays insights on an interactive dashboard.

Built as a three-service microservices architecture — React frontend, Node.js API, and a Python AI server — each deployed independently.

---

## Table of Contents

- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [API Reference](#api-reference)
- [Project Structure](#project-structure)

---

## Architecture

```
┌──────────────────────────────────────────────┐
│            USER BROWSER                       │
│        React SPA  (Vercel CDN)                │
└────────────────┬─────────────────────────────┘
                 │ HTTPS
                 ▼
┌──────────────────────────────────────────────┐
│          NODE.JS API SERVER                   │
│       Express + JWT Auth  (Render)            │
│                                               │
│   /api/users   /api/zip   /api/dashboard      │
│   Auth         Upload     Insights            │
│   Passwords    OCR        History             │
└───────────────┬──────────────────────────────┘
                │
       ┌────────┴──────────┐
       ▼                   ▼
┌─────────────┐   ┌─────────────────────────┐
│  PYTHON AI  │   │      MONGODB ATLAS       │
│  FastAPI    │   │                          │
│  (HF Space) │   │  users   — auth, quotas  │
│             │   │  zips    — metadata      │
│  CLIP       │   │  images  — GridFS binary │
│  ViT-B/32   │   └─────────────────────────┘
└─────────────┘
```

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Material UI 7 | Component library with custom brand theme |
| Recharts 2 | Interactive charts on insights dashboard |
| React Router 6 | Client-side routing |
| Axios | HTTP requests |

### Backend — Node.js
| Technology | Purpose |
|---|---|
| Express 5 | REST API framework |
| Mongoose 8 | MongoDB ODM |
| Tesseract.js 6 | OCR text extraction |
| Sharp 0.34 | Image preprocessing before OCR |
| JWT + bcrypt | Authentication and password hashing |
| Nodemailer | Password reset emails |
| JSZip | ZIP file processing |
| MongoDB GridFS | Binary image storage inside MongoDB |

### Backend — Python AI
| Technology | Purpose |
|---|---|
| FastAPI | AI service framework |
| OpenAI CLIP ViT-B/32 | Zero-shot image classification |
| PyTorch | CLIP model runtime |
| HuggingFace Transformers | Model loading and inference |
| Pillow | Image opening and format handling |
| PyMongo | MongoDB GridFS access |

### Infrastructure
| Service | What runs on it |
|---|---|
| Vercel | React frontend |
| Render | Node.js API server |
| HuggingFace Spaces | Python CLIP AI server |
| MongoDB Atlas | Cloud database |

---

## Features

### Authentication
- JWT login and registration with bcrypt password hashing
- Strong password rules enforced on both client and server
- Forgot password with secure SHA-256 hashed reset tokens (1 hour expiry)
- Change password with current password verification
- Per-user daily upload quotas with automatic midnight UTC reset

### Image Processing
- Upload ZIP files containing JPEG, PNG, WebP, GIF, or BMP images
- Images stored in MongoDB GridFS — no filesystem dependency
- Smart pre-check skips OCR on photos and wallpapers automatically
- OCR preprocessing: grayscale → upscale → normalize → sharpen

### AI Features
- **Image Classification** — OpenAI CLIP zero-shot classification with 35 custom domain labels covering documents, vehicles, products, signboards, and more
- **Text Extraction** — Cached Tesseract worker with preprocessing for 80–85% accuracy on documents
- **Image Analysis** — Dimensions, file size, text confidence score, processing time

### Dashboard
- Storage and daily upload quota gauges
- Bar chart: top detected categories
- Pie chart: text vs non-text images
- Upload history with delete (single and bulk)
- Download all extracted text as a `.txt` file

---

## Getting Started

### Prerequisites
- Node.js 18 or higher
- Python 3.10 or higher
- MongoDB Atlas account (free tier works)

### Installation

```bash
# Clone the repository
git clone https://github.com/Mitali-05/Snapalyze.git
cd Snapalyze

# Node.js dependencies
cd server && npm install

# React dependencies
cd ../client && npm install

# Python environment
cd ../server
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac / Linux
pip install -r requirements.txt
```

### Configure Environment Variables

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Fill in the values. See [Environment Variables](#environment-variables).

### Run Locally

Open three terminals:

```bash
# Terminal 1 — Node.js API (port 5000)
cd server && npm run dev

# Terminal 2 — Python CLIP AI server (port 8000)
cd server && venv\Scripts\activate && uvicorn classify:app --reload --port 8000

# Terminal 3 — React frontend (port 3000)
cd client && npm start
```

Open http://localhost:3000

---

## Environment Variables

### server/.env

| Variable | Required | Description |
|---|---|---|
| `MONGO_URI` | Yes | MongoDB Atlas connection string |
| `JWT_SECRET` | Yes | Random string, minimum 32 characters |
| `PORT` | Yes | Server port (default 5000) |
| `CLIENT_URL` | Yes | Frontend URL for CORS and reset email links |
| `PYTHON_API_URL` | Yes | Python AI server URL |
| `SMTP_HOST` | No | Leave blank to print reset links to console (dev mode) |
| `SMTP_PORT` | No | 587 for Gmail |
| `SMTP_USER` | No | Gmail address |
| `SMTP_PASS` | No | Gmail app password |

### client/.env

| Variable | Required | Description |
|---|---|---|
| `REACT_APP_API_URL` | Yes | Node.js backend URL |

---

## Deployment
**Summary:**
- Frontend → Vercel (free)
- Node.js API → Render (free tier)
- Python AI → HuggingFace Spaces (free, 16GB RAM)
- Database → MongoDB Atlas (already configured)

---

## API Reference

### Auth — /api/users

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /register | No | Register new user |
| POST | /login | No | Login, returns JWT |
| POST | /forgot-password | No | Send password reset email |
| POST | /reset-password/:token | No | Reset password |
| POST | /change-password | JWT | Change password |
| GET | /profile | JWT | Get user profile |

### Images — /api/zip

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /upload | JWT | Upload ZIP file |
| GET | /analyze/:zipId | JWT | Analyze images |
| GET | /classify/:zipId | JWT | Classify with CLIP |
| GET | /ocr/:zipId | JWT | Extract text |
| DELETE | /all | JWT | Delete all uploads |
| DELETE | /:zipId | JWT | Delete one upload |

### Dashboard — /api/dashboard

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | / | JWT | Dashboard data and insights |

---

## Project Structure

```
Snapalyze/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.js
│   │   │   ├── ChangePassword.js
│   │   │   ├── InsightsPanel.js
│   │   │   ├── PageWrapper.js
│   │   │   └── ToastSnackbar.js
│   │   ├── pages/
│   │   │   ├── Dashboard.js
│   │   │   ├── Upload.js
│   │   │   ├── OcrResults.js
│   │   │   ├── ClassifyResults.js
│   │   │   ├── AnalysisResults.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── ForgotPassword.js
│   │   │   └── ResetPassword.js
│   │   ├── context/AuthContext.js
│   │   ├── hooks/useToast.js
│   │   └── theme/theme.js
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── schemas/
│   ├── middleware/
│   ├── config/
│   ├── utils/
│   ├── validations/
│   ├── classify.py
│   ├── requirements.txt
│   ├── index.js
│   └── package.json
│
├── DEPLOYMENT.md
├── .gitignore
└── README.md
```

---

## License

MIT