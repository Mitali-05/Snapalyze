import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';
import { preprocessImage, classifyImage, extractText } from '../utils/processImage.js';

// 📤 Handle Image Upload (moved from index.js)
export const handleImageUpload = async (req, res) => {
  if (!req.file) {
    console.error('❌ No file received in upload request.');
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const ext = path.extname(req.file.originalname).toLowerCase();
  console.log(`📥 Received file: ${req.file.originalname} (${ext})`);

  try {
    if (ext === '.zip') {
      console.log('🗜️ Detected ZIP file. Extracting...');
      const zip = new AdmZip(req.file.path);
      const zipEntries = zip.getEntries();
      const results = [];

      for (let entry of zipEntries) {
        if (!entry.isDirectory && /\.(jpg|jpeg|png)$/i.test(entry.entryName)) {
          console.log(`🔍 Processing file from zip: ${entry.entryName}`);
          const imageBuffer = entry.getData();
          const processedBuffer = await preprocessImage(imageBuffer);
          const category = await classifyImage(processedBuffer);
          const text = await extractText(processedBuffer);
          results.push({
            filename: entry.entryName,
            category,
            extractedText: text
          });
        } else {
          console.log(`⚠️ Skipping non-image or directory: ${entry.entryName}`);
        }
      }

      console.log('✅ ZIP processed successfully.');
      return res.status(200).json({
        message: 'ZIP processed successfully',
        files: results
      });

    } else {
      console.log('🖼️ Single image upload. Processing...');
      const processedBuffer = await preprocessImage(req.file.path);
      const category = await classifyImage(processedBuffer);
      const text = await extractText(processedBuffer);

      console.log(`📊 Classified as: ${category}`);
      return res.status(200).json({
        message: 'Image processed successfully',
        filename: req.file.originalname,
        category,
        extractedText: text,
        filePath: `/uploads/${req.file.filename}`
      });
    }

  } catch (err) {
    console.error('❌ Error during image processing:', err.message);
    return res.status(500).json({ message: 'Image processing failed', error: err.message });
  }
};
