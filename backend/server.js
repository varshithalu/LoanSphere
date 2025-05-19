const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
require("dotenv").config({ path: "../.env" });

const connectDB = require("./config/db");
connectDB(); // connect to MongoDB

// Route files
const authRoutes = require("./routes/authRoutes"); //

const app = express();
app.use(cors());
app.use(express.json());

// Static uploads
app.use("/uploads", express.static("uploads"));

// API routes
app.use("/api/auth", authRoutes);

// Default route
app.get("/", (_, res) => res.send("API is running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// Admin routes
const dashboardRoutes = require("./routes/dashboard");
app.use("/api/dashboard", dashboardRoutes);

// loan override routes
const loanOverrideRoutes = require("./routes/loanOverride");
app.use("/loans", loanOverrideRoutes);

const loanRoutes = require("./routes/loanRoutes");
app.use("/api/loan", loanRoutes);
