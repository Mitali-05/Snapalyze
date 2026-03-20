import express from 'express';
import multer  from 'multer';
import {
  handleZipUpload,
  extractTextFromZipImages,
  classifyZipImages,
  analyzeZipImages,
} from '../controllers/zipController.js';
import {
  deleteZip,
  deleteAllZips,
} from '../controllers/dashboardController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router  = express.Router();
const upload  = multer({ storage: multer.memoryStorage() });

// ── Upload & process ────────────────────────────────────────────────────────
router.post(  '/upload',              authenticateUser, upload.single('file'), handleZipUpload);
router.get(   '/ocr/:zipId',          authenticateUser, extractTextFromZipImages);
router.get(   '/classify/:zipId',     authenticateUser, classifyZipImages);
router.get(   '/analyze/:zipId',      authenticateUser, analyzeZipImages);

// ── Delete (order matters: /all must come before /:zipId) ─────────────────
router.delete('/all',                 authenticateUser, deleteAllZips);
router.delete('/:zipId',              authenticateUser, deleteZip);

export default router;