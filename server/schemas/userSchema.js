import mongoose from 'mongoose';

// Define user schema
const userSchema = new mongoose.Schema({
  // First Name (Now split into firstName and lastName)
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
  // Role (Set to 'user' by default, can be changed to 'admin' or 'moderator')
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
}, { timestamps: true });

export default userSchema;
