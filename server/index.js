import express  from 'express';
import dotenv   from 'dotenv';
import cors     from 'cors';

import connectDB        from './config/db.js';
import userRoutes       from './routes/userRoutes.js';
import zipRoutes        from './routes/zipRoutes.js';
import dashboardRoutes  from './routes/dashboardRoutes.js';

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Connect to MongoDB ─────────────────────────────────────────────────────
connectDB();

// ── CORS — allow localhost in dev + deployed frontend in production ─────────
const allowedOrigins = [
  'http://localhost:3000',
  process.env.CLIENT_URL,          // e.g. https://snapalyze.vercel.app
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
}));

app.use(express.json({ limit: '50mb' }));

// ── Health check — required by Render for deployment ──────────────────────
app.get('/health', (_req, res) =>
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
);

// ── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users',     userRoutes);
app.use('/api/zip',       zipRoutes);

// ── Global error handler ───────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ message: 'Internal server error' });
});

// ── Start ──────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});