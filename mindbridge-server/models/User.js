const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: function() {
      return this.userType !== 'anonymous';
    },
    unique: true,
    sparse: true
  },
  password: {
    type: String,
    required: function() {
      return this.userType !== 'anonymous';
    }
  },
  userType: {
    type: String,
    enum: ['student', 'counselor', 'institute', 'anonymous'],
    required: true
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  anonymousId: {
    type: String,
    unique: true,
    sparse: true
  },
  profile: {
    name: String,
    avatar: String,
    phone: String,
    dateOfBirth: Date,
    gender: String,
    branch: String,
    year: String,
    rollNumber: String
  },
  institute: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institute'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    },
    privacy: {
      shareData: { type: Boolean, default: false },
      anonymousMode: { type: Boolean, default: true }
    }
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || this.userType === 'anonymous') {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (this.userType === 'anonymous') return true;
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate anonymous ID
userSchema.methods.generateAnonymousId = function() {
  const { v4: uuidv4 } = require('uuid');
  this.anonymousId = uuidv4();
  this.isAnonymous = true;
};

module.exports = mongoose.model('User', userSchema);
