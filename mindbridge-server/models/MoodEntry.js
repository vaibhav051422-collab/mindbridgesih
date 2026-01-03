const mongoose = require('mongoose');

const moodEntrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mood: {
    type: String,
    enum: ['very_happy', 'happy', 'neutral', 'sad', 'very_sad', 'anxious', 'stressed', 'angry', 'excited', 'calm'],
    required: true
  },
  intensity: {
    type: Number,
    min: 1,
    max: 10,
    required: true
  },
  notes: {
    type: String,
    maxlength: 500
  },
  tags: [{
    type: String,
    enum: ['academics', 'relationships', 'family', 'health', 'work', 'social', 'financial', 'future', 'other']
  }],
  activities: [{
    type: String,
    enum: ['studying', 'exercise', 'socializing', 'sleeping', 'eating', 'entertainment', 'work', 'travel', 'other']
  }],
  location: {
    type: String,
    enum: ['home', 'college', 'library', 'cafe', 'outdoor', 'other']
  },
  weather: {
    type: String,
    enum: ['sunny', 'cloudy', 'rainy', 'stormy', 'snowy', 'other']
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  institute: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institute'
  },
  branch: String,
  year: String,
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for analytics queries
moodEntrySchema.index({ user: 1, date: -1 });
moodEntrySchema.index({ institute: 1, date: -1 });
moodEntrySchema.index({ branch: 1, year: 1, date: -1 });

module.exports = mongoose.model('MoodEntry', moodEntrySchema);
