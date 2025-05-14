const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
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
  profession: {
    type: String,
    enum: ['unemployed', 'student', 'employee', 'freelancer', 'entrepreneur', 'other'],
    required: true
  },
  organization: {
    type: String,
    trim: true,
    default: ''
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
  },

  // ✅ New: Plan field for Basic or Pro
  plan: {
    type: String,
    enum: ['Basic', 'Pro', null],
    default: null
  }

}, { timestamps: true });

export default userSchema;