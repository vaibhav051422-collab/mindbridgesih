const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  counselor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  institute: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institute',
    required: true
  },
  appointmentDate: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    default: 60, // minutes
    required: true
  },
  type: {
    type: String,
    enum: ['online', 'offline'],
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'],
    default: 'scheduled'
  },
  meetingLink: {
    type: String
  },
  location: {
    type: String,
    required: function() {
      return this.type === 'offline';
    }
  },
  notes: {
    type: String,
    maxlength: 1000
  },
  studentNotes: {
    type: String,
    maxlength: 500
  },
  counselorNotes: {
    type: String,
    maxlength: 1000
  },
  followUpRequired: {
    type: Boolean,
    default: false
  },
  followUpDate: {
    type: Date
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  feedback: {
    type: String,
    maxlength: 500
  },
  isAnonymous: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for efficient queries
appointmentSchema.index({ student: 1, appointmentDate: -1 });
appointmentSchema.index({ counselor: 1, appointmentDate: -1 });
appointmentSchema.index({ institute: 1, appointmentDate: -1 });
appointmentSchema.index({ status: 1, appointmentDate: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
