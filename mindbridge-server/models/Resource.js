const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  type: {
    type: String,
    enum: ['video', 'article', 'book', 'exercise', 'meditation', 'podcast', 'worksheet', 'other'],
    required: true
  },
  category: {
    type: String,
    enum: ['anxiety', 'depression', 'stress', 'mindfulness', 'relationships', 'academics', 'career', 'general_wellness'],
    required: true
  },
  url: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String
  },
  duration: {
    type: Number // in minutes
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  tags: [{
    type: String
  }],
  author: {
    type: String,
    required: true
  },
  source: {
    type: String,
    required: true
  },
  isFree: {
    type: Boolean,
    default: true
  },
  language: {
    type: String,
    default: 'English'
  },
  targetAudience: {
    type: String,
    enum: ['students', 'counselors', 'general', 'all'],
    default: 'students'
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  views: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  institute: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institute'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for efficient queries
resourceSchema.index({ category: 1, type: 1, isActive: 1 });
resourceSchema.index({ tags: 1, isActive: 1 });
resourceSchema.index({ isFeatured: 1, isActive: 1 });
resourceSchema.index({ rating: -1, isActive: 1 });

module.exports = mongoose.model('Resource', resourceSchema);
