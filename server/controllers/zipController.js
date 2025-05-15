import JSZip from 'jszip';
import { GridFSBucket } from 'mongodb';
import Tesseract from 'tesseract.js';
import connectDB from '../config/db.js';
import Zip from '../models/zipModel.js';

/**
 * Handles a zip file upload, extracts image files, and stores them in MongoDB GridFS.
 */
export const handleZipUpload = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const zip = await JSZip.loadAsync(req.file.buffer);
    const images = [];

    // Connect to MongoDB and get the db object
    const db = await connectDB();
    const bucket = new GridFSBucket(db, { bucketName: 'images' });

    // Iterate through the files inside the zip
    await Promise.all(
      Object.keys(zip.files).map(async (filename) => {
        const file = zip.files[filename];

        if (!file.dir && /\.(jpe?g|png|gif|bmp|webp)$/i.test(filename)) {
          const fileData = await file.async('nodebuffer');

          // Create a readable stream for the image buffer
          const stream = bucket.openUploadStream(filename, {
            contentType: 'image/jpeg', // Or use appropriate content type
          });

          // Write the image data to GridFS
          stream.end(fileData);

          // Store image info for DB
          images.push({
            filename,
            fileSize: fileData.length,
            fileType: 'image/jpeg',
          });

          console.log(`✅ Uploaded: ${filename} | Size: ${fileData.length}`);
        }
      })
    );

    // Save metadata to the Zip collection
    const zipEntry = await Zip.create({
      originalFileName: req.file.originalname,
      fileSize: req.file.size,
      images,
    });

    res.status(200).json({
      message: `${images.length} image(s) extracted and stored.`,
      zipId: zipEntry._id,
      files: images.map(img => img.filename),
    });
  } catch (error) {
    console.error('❌ Error processing zip file:', error);
    res.status(500).json({ message: 'Failed to process ZIP file', error: error.message });
  }
};

/**
 * Extracts text from each image in a given ZIP entry using Tesseract.js.
 */
export const extractTextFromZipImages = async (req, res) => {
  try {
    const { zipId } = req.params;

    const db = await connectDB();
    const bucket = new GridFSBucket(db, { bucketName: 'images' });

    // Fetch zip entry from MongoDB
    const zipEntry = await Zip.findById(zipId);
    if (!zipEntry) {
      return res.status(404).json({ message: 'ZIP entry not found' });
    }

    const results = [];

    for (const img of zipEntry.images) {
      const stream = bucket.openDownloadStreamByName(img.filename);

      // Convert stream to buffer
      const chunks = [];
      await new Promise((resolve, reject) => {
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('error', reject);
        stream.on('end', resolve);
      });

      const buffer = Buffer.concat(chunks);

      // OCR with Tesseract
      const { data: { text } } = await Tesseract.recognize(buffer, 'eng', {
        logger: m => console.log(`[OCR] ${img.filename}: ${m.status}`),
      });

      results.push({
        filename: img.filename,
        text: text.trim(),
      });
    }

    res.status(200).json({
      zipId,
      totalImages: zipEntry.images.length,
      results,
    });
  } catch (error) {
    console.error('❌ Error extracting text:', error);
    res.status(500).json({ message: 'Failed to extract text', error: error.message });
  }
};


/* Classifying Images */
// Function to trigger classification via FastAPI
export async function classifyZipImages(req, res) {
  const { zipId } = req.params;

  try {
    // Validate zipId exists in your MongoDB (optional but recommended)
    const zipDoc = await yourZipCollection.findOne({ _id: ObjectId(zipId) });
    if (!zipDoc) return res.status(404).json({ error: 'ZIP not found' });

    // Call FastAPI classification endpoint
    const response = await axios.get(`http://localhost:8000/api/zip/classify/${zipId}`);

    // Forward FastAPI response or save classification results to DB
    return res.json(response.data);

  } catch (error) {
    console.error("Classification error:", error.message);
    return res.status(500).json({ error: 'Classification failed', details: error.message });
  }
}

