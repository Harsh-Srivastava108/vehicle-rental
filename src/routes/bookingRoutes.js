
import express from "express";
import Booking from "../models/booking.js";
import Vehicle from "../models/vehicle.js";
import auth from "../middlewares/authMiddleware.js";

const router = express.Router();

// 📌 GET all bookings with vehicle populated
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find().populate("vehicle");
    res.json(bookings);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

// 📌 POST new booking (protected by auth)
router.post("/",  async (req, res) => {
  const { vehicleId, vehicle, startDate, endDate, totalPrice, userName, userEmail } = req.body;

const finalVehicleId = vehicleId || vehicle;

// Check if vehicle exists
const foundVehicle = await Vehicle.findById(finalVehicleId);
if (!foundVehicle) {
  return res.status(404).json({ message: "Vehicle not found" });
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

export default router;

