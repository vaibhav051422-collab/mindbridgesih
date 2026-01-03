const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 8000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB (optional)
mongoose.connect('mongodb://localhost:27017/mindbridge', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => {
  console.log('⚠️ MongoDB not available, running without database');
  console.log('❌ MongoDB connection error:', err.message);
});

// ==================== BASIC ROUTES ====================

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'MindBridge API is running! 🧠🌉',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      mood: '/api/mood',
      analytics: '/api/analytics',
      community: '/api/community',
      resources: '/api/resources',
      appointments: '/api/appointments'
    }
  });
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API is working!',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 MindBridge Server is running on http://localhost:${port}`);
  console.log(`📊 API Documentation: http://localhost:${port}/`);
  console.log(`🔗 Database: MongoDB`);
});
