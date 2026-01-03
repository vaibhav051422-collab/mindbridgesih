const mongoose = require('mongoose');

const instituteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  contactInfo: {
    phone: String,
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: { type: String, default: 'India' }
    },
    website: String
  },
  branding: {
    logo: String,
    primaryColor: { type: String, default: '#3B82F6' },
    secondaryColor: { type: String, default: '#1E40AF' },
    customCSS: String
  },
  settings: {
    allowAnonymous: { type: Boolean, default: true },
    requireVerification: { type: Boolean, default: false },
    maxCounselors: { type: Number, default: 10 },
    enableCommunityWall: { type: Boolean, default: true },
    enableAnalytics: { type: Boolean, default: true }
  },
  branches: [{
    name: String,
    code: String,
    description: String
  }],
  years: [{
    name: String,
    code: String,
    description: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  subscription: {
    plan: { type: String, enum: ['free', 'basic', 'premium'], default: 'free' },
    startDate: Date,
    endDate: Date,
    maxStudents: { type: Number, default: 100 }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Institute', instituteSchema);
