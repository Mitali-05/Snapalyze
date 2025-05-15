import JSZip from 'jszip';
import { GridFSBucket } from 'mongodb';
import connectDB from '../config/db.js';
import Zip from '../models/zipmodels.js';

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
    let totalSize = 0;

    const db = await connectDB();
    const bucket = new GridFSBucket(db, { bucketName: 'images' });

    await Promise.all(
      Object.keys(zip.files).map(async (filename) => {
        const file = zip.files[filename];

        if (!file.dir && /\.(jpe?g|png|gif|bmp|webp)$/i.test(filename)) {
          const fileData = await file.async('nodebuffer');
          const ext = filename.split('.').pop().toLowerCase();

          totalSize += fileData.length;

          const stream = bucket.openUploadStream(filename, {
            contentType: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
          });

          stream.end(fileData);

          images.push({
            filename,
            fileSize: fileData.length,
            fileType: ext,
          });

          console.log(`Uploaded ${filename}`);
        }
      })
    );

    // Save metadata in Zip collection
    const savedZip = await Zip.create({
      originalFileName: req.file.originalname,
      fileSize: totalSize,
      uploadedAt: new Date(),
      images,
    });

    res.status(200).json({
      message: `${images.length} image(s) stored in GridFS.`,
      zipId: savedZip._id,
      images,
    });
  } catch (error) {
    console.error('Error processing zip file:', error);
    res.status(500).json({ message: 'Failed to process ZIP file', error: error.message });
  }
};
