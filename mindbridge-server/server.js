require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

const app = express();
const port = process.env.PORT || 8000;
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/mindbridge";

// Middleware
const allowedOrigins = process.env.CLIENT_URL
  ? [process.env.CLIENT_URL]
  : ["http://localhost:5173", "http://localhost:3000"];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.log("MongoDB not available, running without database");
    console.log("MongoDB connection error:", err.message);
  });

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "MindBridge API is running!",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      mood: "/api/mood",
      analytics: "/api/analytics",
      community: "/api/community",
      resources: "/api/resources",
      appointments: "/api/appointments",
    },
  });
});

// Test route
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "API is working!",
    timestamp: new Date().toISOString(),
  });
});

app.listen(port, () => {
  console.log(`MindBridge Server is running on port ${port}`);
  console.log(`API Documentation: http://localhost:${port}/`);
  console.log(`Database: MongoDB`);
});
