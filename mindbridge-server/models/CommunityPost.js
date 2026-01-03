const mongoose = require('mongoose');

const communityPostSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  institute: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institute',
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    maxlength: 2000
  },
  category: {
    type: String,
    enum: ['success_story', 'advice', 'question', 'resource_share', 'motivation', 'general'],
    required: true
  },
  tags: [{
    type: String,
    enum: ['anxiety', 'depression', 'stress', 'academics', 'relationships', 'career', 'health', 'motivation', 'tips', 'other']
  }],
  isAnonymous: {
    type: Boolean,
    default: true
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  },
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    likedAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: 500
    },
    isAnonymous: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  views: {
    type: Number,
    default: 0
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  isReported: {
    type: Boolean,
    default: false
  },
  reportReason: {
    type: String,
    enum: ['inappropriate', 'spam', 'harassment', 'false_information', 'other']
  }
}, {
  timestamps: true
});

// Index for efficient queries
communityPostSchema.index({ institute: 1, createdAt: -1 });
communityPostSchema.index({ category: 1, isApproved: 1, createdAt: -1 });
communityPostSchema.index({ tags: 1, isApproved: 1 });
communityPostSchema.index({ isPinned: 1, createdAt: -1 });

module.exports = mongoose.model('CommunityPost', communityPostSchema);
