import mongoose from 'mongoose';

const zipSchema = new mongoose.Schema({
  originalFileName: { type: String, required: true },
  fileSize: { type: Number, required: true },
  uploadedAt: { type: Date, default: Date.now },
  images: [
    {
      filename: { type: String, required: true },
      fileSize: { type: Number, required: true },
      fileType: { type: String, required: true },
    }
  ],
}, { timestamps: true });

export default zipSchema;
