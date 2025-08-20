// src/routes/bookingRoutes.js
import express from "express";
import Booking from "../models/booking.js";
import Vehicle from "../models/vehicle.js";
import auth from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * 📌 GET all bookings (with vehicle details populated)
 * Protected route → only logged-in users should access their own bookings.
 */
router.get("/", auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ userEmail: req.user.email })
      .populate("vehicle")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    console.error("❌ Error fetching bookings:", err);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

/**
 * 📌 GET a single booking by ID
 */
router.get("/:id", auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("vehicle");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Security → user can only access their own booking
    if (booking.userEmail !== req.user.email) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    res.json(booking);
  } catch (err) {
    console.error("❌ Error fetching booking:", err);
    res.status(500).json({ error: "Failed to fetch booking" });
  }
});

/**
 * 📌 POST new booking
 */
router.post("/", auth, async (req, res) => {
  try {
    const { vehicleId, vehicle, startDate, endDate, totalPrice } = req.body;

    const finalVehicleId = vehicleId || vehicle; // support both keys

    // ✅ User info from JWT
    const userEmail = req.user.email;
    const userName = req.user.email.split("@")[0]; // later replace with user profile

    // Check if vehicle exists
    const foundVehicle = await Vehicle.findById(finalVehicleId);
    if (!foundVehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    // Check if vehicle is already booked during the requested period
    const overlappingBooking = await Booking.findOne({
      vehicle: finalVehicleId,
      $or: [
        { startDate: { $lte: endDate }, endDate: { $gte: startDate } },
      ],
    });

    if (overlappingBooking) {
      return res.status(400).json({ message: "Vehicle already booked for these dates" });
    }

    const booking = new Booking({
      vehicle: finalVehicleId,
      userName,
      userEmail,
      startDate,
      endDate,
      totalPrice,
    });

    const savedBooking = await booking.save();
    res.status(201).json(savedBooking);
  } catch (err) {
    console.error("❌ Error creating booking:", err);
    res.status(400).json({ message: err.message || "Bad Request" });
  }
});

/**
 * 📌 DELETE a booking
 */
router.delete("/:id", auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.userEmail !== req.user.email) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    await booking.deleteOne();
    res.json({ message: "Booking cancelled successfully" });
  } catch (err) {
    console.error("❌ Error deleting booking:", err);
    res.status(500).json({ error: "Failed to cancel booking" });
  }
});

export default router;
