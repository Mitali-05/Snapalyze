import express from 'express';
import multer from 'multer';
import { handleZipUpload,extractTextFromZipImages,classifyZipImages } from '../controllers/zipController.js';

const router = express.Router();

// Store file in memory instead of saving to disk
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route for uploading ZIP files (file field name should be 'file')
router.post('/upload', upload.single('file'), handleZipUpload);
router.get('/extract-text/:zipId', extractTextFromZipImages);
router.get('/classify/:zipId', classifyZipImages);

export default router;
