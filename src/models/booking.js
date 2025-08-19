// src/models/booking.js
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle", // 👈 references Vehicle collection
      required: true,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    userEmail: {
      type: String,
      required: true,
      lowercase: true, // 👈 ensures all emails are stored lowercase
      match: [/.+@.+\..+/, "Please enter a valid email"], // 👈 basic email validation
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value > this.startDate; // 👈 ensures endDate is after startDate
        },
        message: "End date must be after start date",
      },
    },
    totalPrice: {
      type: Number,
      required: true,
      min: [0, "Price must be positive"], // 👈 prevents negative price
    },
    status: {
      type: String,
      enum: ["confirmed", "cancelled"], // 👈 only allow these values
      default: "confirmed",
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
