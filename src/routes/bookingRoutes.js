import express from "express";
import Booking from "../models/booking.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create booking
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { vehicleId, startDate, endDate, totalPrice } = req.body;

    if (!vehicleId || !startDate || !endDate || !totalPrice) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const booking = new Booking({
      vehicle: vehicleId,
      user: req.user.id, // coming from authMiddleware
      startDate,
      endDate,
      totalPrice,
    });

    await booking.save();
    res.status(201).json({ message: "Booking created", booking });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get bookings for logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate("vehicle");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
