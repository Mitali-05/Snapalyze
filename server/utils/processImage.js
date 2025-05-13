// utils/processImage.js
import sharp from 'sharp';
import tesseract from 'tesseract.js';

// 📜 TEXT EXTRACTION FUNCTION
export const extractText = async (imageBuffer) => {
  const { data: { text } } = await tesseract.recognize(imageBuffer, 'eng');
  return text;
};

// 🖼️ IMAGE PROCESSING FUNCTION
export const preprocessImage = async (filePath) => {
  const imageBuffer = await sharp(filePath)
    .resize(500)
    .jpeg()
    .toBuffer();

  return imageBuffer;
};

// 📦 CLASSIFICATION FUNCTION (placeholder)
export const classifyImage = async (imageBuffer) => {
  const categories = ['educational', 'medical', 'job', 'bill', 'other'];
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  return randomCategory;
};
