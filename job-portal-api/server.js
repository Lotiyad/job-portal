const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require("path");
const cors = require("cors");



dotenv.config();
connectDB();

const app = express();
app.use(cors({
  origin: "*", // Allow all origins for deployed backend
  credentials: true
}));
// Middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to Job Portal API");
});

// Database status endpoint
app.get("/api/db-status", async (req, res) => {
  try {
    const mongoose = require("mongoose");
    const dbState = mongoose.connection.readyState;
    
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    
    const status = {
      databaseState: states[dbState],
      isConnected: dbState === 1,
      mongoURI: process.env.MONGO_URI ? 'configured' : 'missing',
      envVars: {
        MONGO_URI: process.env.MONGO_URI ? 'set' : 'not set',
        JWT_SECRET: process.env.JWT_SECRET ? 'set' : 'not set',
        PORT: process.env.PORT || '5000'
      }
    };
    
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
app.use("/api/auth", authRoutes);
const jobRoutes = require("./routes/jobRoutes");
app.use("/api/jobs", jobRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/applications", require("./routes/applicationRoutes"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
