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
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'User ID is required'],  // <-- required with error message
    validate: {
      validator: v => !!v,
      message: 'User ID must be provided'
    }
  },  
}, { timestamps: true });

export default zipSchema;
