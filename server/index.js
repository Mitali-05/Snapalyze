import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import zipRoutes from './routes/zipRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Setup __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 🔌 Connect to MongoDB
connectDB();

// 🌍 Middleware
app.use(cors());
app.use(express.json());

// 🔗 Routes
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes);
app.use('/api/zip', zipRoutes); // ✅ ZIP upload

// 🚀 Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
