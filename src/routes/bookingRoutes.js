import express from "express";
import { v4 as uuidv4 } from "uuid";
import auth from "../middleware/auth.js";

const router = express.Router();

// In-memory store (replace with DB later)
let bookings = [];

// Create a booking
router.post("/", async (req, res) => {
  try {
    const { vehicleId, startDate, endDate, price } = req.body;
    
    const booking = new Booking({ vehicleId, startDate, endDate, price });
    await booking.save();

    res.json({ message: "Booking created successfully", booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all bookings for logged-in user
router.get("/", auth, (req, res) => {
  try {
    const userBookings = bookings.filter(
      (booking) => booking.userId === req.user.id
    );
    res.json(userBookings);
  } catch (err) {
    res.status(500).json({ error: "Server error while fetching bookings" });
  }
});

export default router;
