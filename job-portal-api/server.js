const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require("path");
const cors = require("cors");



dotenv.config();
connectDB();

const app = express();
app.use(cors({
  origin: "http://localhost:3000", // your React app
  credentials: true
}));
// Middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to Job Portal API 🚀");
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
