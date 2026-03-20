# Snapalyze — Client

React single-page application for Snapalyze.

---

## Folder Structure

```
client/src/
├── components/
│   ├── Header.js            # Fixed navbar — active page highlight, consistent max-width
│   ├── ChangePassword.js    # Password form with live strength meter and forgot password link
│   ├── InsightsPanel.js     # Recharts bar + pie charts for dashboard
│   ├── PageWrapper.js       # Brand gradient background wrapper used by all pages
│   ├── ToastSnackbar.js     # Global toast notification component
│   ├── ProtectedRoute.js    # Redirects to /login if no JWT token
│   └── PublicRoute.js       # Redirects to /dashboard if already logged in
│                             Note: / (landing page) is always accessible
│
├── pages/
│   ├── Home.js              # Landing page with features, pricing, about
│   ├── Login.js             # Split-panel login with forgot password link
│   ├── Register.js          # Registration with live password strength checklist
│   ├── ForgotPassword.js    # Email entry with resend link support
│   ├── ResetPassword.js     # Token-based reset with strength meter
│   ├── Dashboard.js         # Stats, insights, upload history, delete actions
│   ├── Upload.js            # ZIP upload, action buttons, searchable history
│   ├── OcrResults.js        # OCR results — shows skip explanation for photos
│   ├── ClassifyResults.js   # CLIP classification — card grid with search filter
│   ├── AnalysisResults.js   # Metadata table with image preview dialogs
│   └── NotFound.js          # 404 page
│
├── context/
│   └── AuthContext.js       # JWT token and userId stored in localStorage
│
├── hooks/
│   └── useToast.js          # Toast notification state hook
│
└── theme/
    └── theme.js             # MUI theme using brand colors from the Snapalyze logo
```

---

## Setup

```bash
npm install
cp .env.example .env

npm start          # development on port 3000
npm run build      # production build → /build folder
```

---

## Environment Variables

```env
# Development
REACT_APP_API_URL=http://localhost:5000

# Production — set in Vercel dashboard
REACT_APP_API_URL=https://snapalyze-server.onrender.com
```

---

## Design System

Colors in `src/theme/theme.js` are extracted from the Snapalyze logo:

| Name | Hex | Used for |
|---|---|---|
| `BRAND.blue` | `#1e7bc4` | Primary buttons, links, active states |
| `BRAND.navy` | `#0d2e3f` | Headings, body text |
| `BRAND.green` | `#4a8c3f` | Secondary buttons, success |
| `BRAND.teal` | `#1a6b6b` | Accents, OCR results |
| `BRAND.greenLight` | `#7db84a` | Charts, positive indicators |

All page containers use `maxWidth: CONTENT_MAX` (1200px) exported from `Header.js`. This keeps the header and page content left-edges aligned on every page.

---

## Route Map

```
/                      Landing page (always accessible)
/login                 Redirects to /dashboard if already logged in
/register              Redirects to /dashboard if already logged in
/forgot-password       Always accessible
/reset-password/:token Always accessible
/dashboard             Protected — requires JWT
/upload                Protected — requires JWT
*                      404
```

---

## Deployment

Deployed to Vercel.


Vercel settings:
- Root directory: `client`
- Build command: `npm run build`
- Output directory: `build`