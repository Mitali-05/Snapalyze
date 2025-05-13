import express from 'express';
import multer from 'multer';
import { handleZipUpload } from '../controllers/zipController.js';

const router = express.Router();

// Store file in memory instead of saving to disk
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route for uploading ZIP files (file field name should be 'file')
router.post('/upload', upload.single('file'), handleZipUpload);

export default router;
