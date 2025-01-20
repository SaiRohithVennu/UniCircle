import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/@mail\.uc\.edu$/, 'Must be a valid UC email']
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  department: {
    type: String,
    required: true
  },
  isPhoneVerified: {
    type: Boolean,
    default: false
  },
  phoneVerificationCode: {
    code: String,
    expiresAt: Date
  },
  avatar: String,
  bio: String,
  interests: [String],
  projects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }],
  connections: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to set verification code
userSchema.methods.setVerificationCode = function(code) {
  this.phoneVerificationCode = {
    code,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes expiry
  };
};

// Method to verify OTP
userSchema.methods.verifyOTP = function(code) {
  return (
    this.phoneVerificationCode &&
    this.phoneVerificationCode.code === code &&
    this.phoneVerificationCode.expiresAt > new Date()
  );
};

export const User = mongoose.model('User', userSchema);