import express from 'express';
import multer from 'multer';
import { handleZipUpload, extractTextFromZipImages, classifyZipImages, analyzeZipImages } from '../controllers/zipController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';  // <-- import your auth middleware

const router = express.Router();

// Store file in memory instead of saving to disk
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Protect routes with authenticateUser middleware
router.post('/upload', authenticateUser, upload.single('file'), handleZipUpload);
router.get('/ocr/:zipId', authenticateUser, extractTextFromZipImages);
router.get('/classify/:zipId', authenticateUser, classifyZipImages);
router.get('/analyze/:zipId', authenticateUser, analyzeZipImages);

export default router;
