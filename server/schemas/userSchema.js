import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    firstName:    { type: String, required: true, trim: true },
    lastName:     { type: String, required: true, trim: true },
    email: {
      type: String, required: true, unique: true,
      lowercase: true, trim: true,
    },
    password:     { type: String, required: true },
    profession: {
      type: String,
      enum: ['unemployed', 'student', 'employee', 'freelancer', 'entrepreneur', 'other'],
      required: true,
    },
    organization: { type: String, trim: true, default: '' },
    role:         { type: String, enum: ['user', 'admin'], default: 'user' },
    isActive:     { type: Boolean, default: true },
    lastLogin:    { type: Date },

    // Plan
    planType: { type: String, enum: ['Free', 'Pro', 'Enterprise'], default: 'Free' },
    dailyUploadLimit: { type: Number, default: 2 },
    storageLimit:     { type: Number, default: 10_000_000 },

    // Daily tracking
    dailyUploadCount: { type: Number, default: 0 },
    lastUploadDate:   { type: Date, default: null },
    usedStorage:      { type: Number, default: 0 },

    // Forgot/Reset Password
    passwordResetToken:   { type: String, default: null },
    passwordResetExpires: { type: Date,   default: null },
  },
  { timestamps: true }
);

export default userSchema;