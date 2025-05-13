import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import imageRoutes from './routes/imageRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Setup __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 🔌 Connect to MongoDB
connectDB();

// 📂 Ensure 'uploads' folder exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// 🌍 Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadDir));

// 🔗 Routes
app.use('/api/users', userRoutes);
app.use('/api/images', imageRoutes);

// 🚀 Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
