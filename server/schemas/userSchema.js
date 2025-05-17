import mongoose from 'mongoose';

// Define user schema
const userSchema = new mongoose.Schema({
  // First Name
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  // Last Name
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  // Email
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  // Password
  password: {
    type: String,
    required: true,
  },
  // Profession
  profession: {
    type: String,
    enum: ['unemployed', 'student', 'employee', 'freelancer', 'entrepreneur', 'other'],
    required: true
  },
  // Organization (Optional)
  organization: {
    type: String,
    trim: true,
    default: ''
  },
  // Role (default is user)
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  // Active Status
  isActive: {
    type: Boolean,
    default: true
  },
  // Last Login
  lastLogin: {
    type: Date,
  },

  // ✅ Plan Info
  planType: {
    type: String,
    enum: ['Free', 'Pro', 'Enterprise'],
    default: 'Free',
  },
  dailyUploadLimit: {
    type: Number,
    default: 2, // for Free plan
  },
  storageLimit: {
    type: Number,
    default: 10000000, // in bytes (500KB) or adjust to MB (e.g., 100 * 1024 * 1024)
  },

}, { timestamps: true });

export default userSchema;
