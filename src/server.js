// src/server.js
import bookingRoutes from './routes/bookingRoutes.js'; // ✅ Add booking routes
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import vehicleRoutes from './routes/vehicleRoutes.js';
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// __dirname fix for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/bookings', bookingRoutes); // ✅ Booking API
app.use("/api/auth", authRoutes);

app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
