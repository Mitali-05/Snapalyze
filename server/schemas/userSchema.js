import mongoose from 'mongoose';

// Define user schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'], // example roles
    default: 'user'
  },
  profileImage: {
    type: String,  // URL or path to the image
    default: 'default.jpg'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
  },
}, { timestamps: true });


export default userSchema;
