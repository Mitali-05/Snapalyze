// controllers/zipController.js
import JSZip from 'jszip';
import { GridFSBucket } from 'mongodb';
import connectDB from '../config/db.js';  // Correct import

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

    // Create GridFS Bucket for storing files in MongoDB
    const bucket = new GridFSBucket(db, { bucketName: 'images' });

    // Iterate through the files inside the zip
    await Promise.all(
      Object.keys(zip.files).map(async (filename) => {
        const file = zip.files[filename];

        if (!file.dir && /\.(jpe?g|png|gif|bmp|webp)$/i.test(filename)) {
          const fileData = await file.async('nodebuffer');

          // Create a readable stream for the image buffer
          const stream = bucket.openUploadStream(filename, {
            contentType: 'image/jpeg', // Or use other appropriate content type
          });

          // Write the image data to GridFS
          stream.end(fileData);

          // Store image info for response
          images.push({
            filename,
            id: stream.id,
          });

          // Log the success of image upload to GridFS
          console.log(`Successfully uploaded ${filename} with ID: ${stream.id}`);
        }
      })
    );

    // Example response (or process the images as needed)
    res.status(200).json({
      message: `${images.length} image(s) extracted and stored in GridFS.`,
      files: images.map((img) => img.filename),
    });
  } catch (error) {
    console.error('Error processing zip file:', error);
    res.status(500).json({ message: 'Failed to process ZIP file', error: error.message });
  }
};
