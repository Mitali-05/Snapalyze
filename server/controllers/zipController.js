import JSZip from 'jszip';
import { GridFSBucket } from 'mongodb';
import Tesseract from 'tesseract.js';
import axios from 'axios';
import connectDB from '../config/db.js';
import Zip from '../models/zipModel.js';
import sharp from 'sharp';
import mime from 'mime-types';
import User from '../models/userModel.js';

// Utility: Download file from GridFS as Buffer
const getImageBufferFromGridFS = (bucket, filename) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    const stream = bucket.openDownloadStreamByName(filename);
    stream.on('data', chunk => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });

// Utility: Run OCR on Buffer using Tesseract.js
const runOCR = async (buffer, filename = '') => {
  const startTime = Date.now();
  const { data } = await Tesseract.recognize(buffer, 'eng', {
    logger: m => console.log(`[OCR] ${filename}: ${m.status}`),
  });
  const duration = Date.now() - startTime;

  const avgConfidence = data.words?.length
    ? data.words.reduce((sum, w) => sum + (w.confidence || 0), 0) / data.words.length
    : 0;

  return {
    text: data.text.trim(),
    preview: data.text.trim().substring(0, 100),
    wordCount: data.words?.length || 0,
    lineCount: data.lines?.length || 0,
    confidence: Number(avgConfidence.toFixed(2)),
    duration,
  };
};

// Upload ZIP file and store images in GridFS
export const handleZipUpload = async (req, res) => {
  try {
    if (!req.file?.buffer)
      return res.status(400).json({ message: 'No file uploaded' });
    if (!req.user?._id)
      return res.status(401).json({ message: 'Unauthorized' });

    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: 'User not found' });

    const currentStorage = user.usedStorage || 0;
    const maxStorage = user.storageLimit || Infinity;
    const maxUploads = user.uploadLimit ?? Infinity;

    if (currentStorage >= maxStorage) {
      return res.status(400).json({
        message: 'Storage limit already exceeded. Please upgrade your plan.',
        usedStorage: currentStorage,
        storageLimit: maxStorage,
      });
    }

    // Load ZIP and filter images
    const zip = await JSZip.loadAsync(req.file.buffer);
    const imageFiles = Object.values(zip.files).filter(
      file => !file.dir && /\.(jpe?g|png|gif|bmp|webp)$/i.test(file.name)
    );

    if (imageFiles.length === 0) {
      return res.status(400).json({ message: 'No image files found in ZIP' });
    }

    if (maxUploads < imageFiles.length) {
      return res.status(400).json({ message: 'Upload limit reached. Please upgrade your plan.' });
    }

    let totalZipImagesSize = 0;
    for (const file of imageFiles) {
      totalZipImagesSize += file.uncompressedSize || 0;
    }

    if (currentStorage + totalZipImagesSize > maxStorage) {
      return res.status(400).json({ message: 'Storage limit exceeded. Please upgrade your plan.' });
    }

    const db = await connectDB();
    const bucket = new GridFSBucket(db, { bucketName: 'images' });

    const images = [];

    await Promise.all(
      imageFiles.map(async (file) => {
        try {
          const fileData = await file.async('nodebuffer');
          const mimeType = mime.lookup(file.name) || 'image/jpeg';

          await new Promise((resolve, reject) => {
            const uploadStream = bucket.openUploadStream(file.name, { contentType: mimeType });
            uploadStream.end(fileData);
            uploadStream.on('finish', resolve);
            uploadStream.on('error', reject);
          });

          images.push({ filename: file.name, fileSize: fileData.length, fileType: mimeType });
          console.log(`✅ Uploaded: ${file.name} (${fileData.length} bytes)`);
        } catch (err) {
          console.warn(`⚠️ Failed to upload ${file.name}:`, err.message);
        }
      })
    );

    if (images.length === 0) {
      return res.status(500).json({ message: 'No images were uploaded successfully.' });
    }

    // Update user limits safely
    user.uploadLimit = Math.max(0, (user.uploadLimit ?? Infinity) - 1);
    user.usedStorage = currentStorage + images.reduce((sum, img) => sum + img.fileSize, 0);
    await user.save();

    const zipEntry = await Zip.create({
      originalFileName: req.file.originalname,
      fileSize: req.file.size,
      images,
      userId,
    });

    res.status(200).json({
      message: `${images.length} image(s) stored.`,
      zipId: zipEntry._id,
      files: images.map(img => img.filename),
      remainingUploadLimit: user.uploadLimit,
      usedStorage: user.usedStorage,
      storageLimit: user.storageLimit,
    });
  } catch (err) {
    console.error('❌ Zip upload error:', err);
    res.status(500).json({ message: 'Failed to process ZIP', error: err.message });
  }
};


// Extract text from stored images via OCR
export const extractTextFromZipImages = async (req, res) => {
  try {
    if (!req.user?._id) return res.status(401).json({ message: 'Unauthorized' });

    const { zipId } = req.params;
    const zipEntry = await Zip.findById(zipId);
    if (!zipEntry) return res.status(404).json({ message: 'ZIP entry not found' });
    if (zipEntry.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const db = await connectDB();
    const bucket = new GridFSBucket(db, { bucketName: 'images' });

    const results = await Promise.all(
      zipEntry.images.map(async img => {
        try {
          const buffer = await getImageBufferFromGridFS(bucket, img.filename);
          const { text } = await runOCR(buffer, img.filename);
          return { filename: img.filename, text };
        } catch (err) {
          console.warn(`⚠️ OCR failed for ${img.filename}:`, err.message);
          return { filename: img.filename, text: '', error: err.message };
        }
      })
    );

    res.status(200).json({ zipId, totalImages: zipEntry.images.length, results });
  } catch (err) {
    console.error('❌ Text extraction error:', err);
    res.status(500).json({ message: 'Failed to extract text', error: err.message });
  }
};

// Call classification service for ZIP images
export const classifyZipImages = async (req, res) => {
  try {
    if (!req.user?._id) return res.status(401).json({ message: 'Unauthorized' });

    const { zipId } = req.params;
    const zipDoc = await Zip.findById(zipId);
    if (!zipDoc) return res.status(404).json({ message: 'ZIP not found' });
    if (zipDoc.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const response = await axios.get(`http://localhost:8000/api/zip/classify/${zipId}`);
    return res.json(response.data);
  } catch (err) {
    console.error('❌ Classification error:', err);
    return res.status(500).json({ error: 'Classification failed', details: err.message });
  }
};

// Analyze images: metadata, OCR, preview image
export const analyzeZipImages = async (req, res) => {
  try {
    if (!req.user?._id) return res.status(401).json({ message: 'Unauthorized' });

    const { zipId } = req.params;
    const zipEntry = await Zip.findById(zipId);
    if (!zipEntry) return res.status(404).json({ message: 'ZIP entry not found' });

    if (zipEntry.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const db = await connectDB();
    const bucket = new GridFSBucket(db, { bucketName: 'images' });

    const analyzed = await Promise.all(
      zipEntry.images.map(async img => {
        try {
          const buffer = await getImageBufferFromGridFS(bucket, img.filename);

          if (!buffer || buffer.length === 0) {
            console.warn(`⚠️ Buffer empty for ${img.filename}`);
            return {
              filename: img.filename,
              fileSize: img.fileSize,
              error: 'Could not load image from storage',
            };
          }

          let metadata = { width: null, height: null };
          try {
            metadata = await sharp(buffer).metadata();
          } catch (e) {
            console.warn(`⚠️ Metadata read failed for ${img.filename}:`, e.message);
          }

          const ocr = await runOCR(buffer, img.filename);

          const mimeType = mime.lookup(img.filename) || 'image/jpeg';
          const base64Image = buffer.toString('base64');
          const dataUri = `data:${mimeType};base64,${base64Image}`;

          return {
            filename: img.filename,
            fileSize: img.fileSize,
            imageDimensions: { width: metadata.width, height: metadata.height },
            hasText: !!ocr.text,
            textConfidence: ocr.confidence,
            language: 'eng',
            wordCount: ocr.wordCount,
            lineCount: ocr.lineCount,
            previewText: ocr.preview,
            processingTimeMs: ocr.duration,
            imagePreview: dataUri,
          };
        } catch (err) {
          console.warn(`⚠️ Analysis failed for ${img.filename}:`, err.message);
          return {
            filename: img.filename,
            error: err.message,
          };
        }
      })
    );

    res.status(200).json({
      zipId,
      totalImages: zipEntry.images.length,
      analyzed,
    });
  } catch (err) {
    console.error('❌ Analysis error:', err);
    res.status(500).json({ message: 'Failed to analyze images', error: err.message });
  }
};
