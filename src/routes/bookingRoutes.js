import express from "express";
import Booking from "../models/booking.js";
import Vehicle from "../models/vehicle.js";
import auth from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * 📌 GET all bookings for the logged-in user (with vehicle details)
 */
router.get("/", auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ userEmail: req.user.email })
      .populate("vehicle")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    console.error("❌ Error fetching bookings:", err);
    res.status(500).json({ message: "Failed to fetch bookings" });
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

    if (booking.userEmail !== req.user.email) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    res.json(booking);
  } catch (err) {
    console.error("❌ Error fetching booking:", err);
    res.status(500).json({ message: "Failed to fetch booking" });
  }
});

/**
 * 📌 POST → Create a new booking
 */
router.post("/", auth, async (req, res) => {
  try {
    const { vehicleId, startDate, endDate, totalPrice } = req.body;

    if (!vehicleId || !startDate || !endDate || !totalPrice) {
      return res.status(400).json({ message: "Missing required booking fields" });
    }

    // ✅ Verify vehicle exists
    const foundVehicle = await Vehicle.findById(vehicleId);
    if (!foundVehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    // ✅ Prevent overlapping bookings
    const overlappingBooking = await Booking.findOne({
      vehicle: vehicleId,
      $and: [
        { startDate: { $lte: new Date(endDate) } },
        { endDate: { $gte: new Date(startDate) } },
      ],
    });

    if (overlappingBooking) {
      return res.status(400).json({ message: "Vehicle already booked for these dates" });
    }

    // ✅ Get user details from JWT
    const userEmail = req.user.email;
    const userName = req.user.email.split("@")[0];

    // ✅ Create booking
    const booking = new Booking({
      vehicle: vehicleId,
      userName,
      userEmail,
      startDate,
      endDate,
      totalPrice,
    });

    const savedBooking = await booking.save();
    await savedBooking.populate("vehicle");

    res.status(201).json(savedBooking);
  } catch (err) {
    console.error("❌ Error creating booking:", err);
    res.status(500).json({ message: "Failed to create booking" });
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
    res.status(500).json({ message: "Failed to cancel booking" });
  }
});

export default router;
