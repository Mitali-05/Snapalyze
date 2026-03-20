import mongoose from 'mongoose';

const zipSchema = new mongoose.Schema(
  {
    originalFileName: { type: String, required: true },
    fileSize:         { type: Number, required: true },
    uploadedAt:       { type: Date,   default: Date.now },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    images: [
      {
        filename: { type: String, required: true },
        fileSize: { type: Number, required: true },
        fileType: { type: String, required: true },
      },
    ],

    // ── Cached results for Insights dashboard ────────────────────────────
    analysisResults: [
      {
        filename:         String,
        hasText:          Boolean,
        processingTimeMs: Number,
        topCategory:      String,   // top classification label
        confidence:       Number,
      },
    ],
    analysedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default zipSchema;