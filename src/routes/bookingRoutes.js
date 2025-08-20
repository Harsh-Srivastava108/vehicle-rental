import express from "express";
import { v4 as uuidv4 } from "uuid";
import auth from "../middleware/auth.js";

const router = express.Router();

// In-memory store (replace with DB later)
let bookings = [];

// Create a booking
router.post("/", auth, (req, res) => {
  try {
    const { vehicleId, name, email, date } = req.body;

    if (!vehicleId || !name || !email || !date) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newBooking = {
      id: uuidv4(),
      vehicleId,
      name,
      email,
      date,
      userId: req.user.id, // from token
    };

    bookings.push(newBooking);
    res.status(201).json(newBooking);
  } catch (err) {
    res.status(500).json({ error: "Server error while creating booking" });
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
