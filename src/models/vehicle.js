  import mongoose from "mongoose";

  const vehicleSchema = new mongoose.Schema(
    {
      make: { type: String, required: true },       // e.g., Toyota
      model: { type: String, required: true },      // e.g., Corolla
      year: { type: Number, required: true },       // e.g., 2022
      pricePerDay: { type: Number, required: true },
      available: { type: Boolean, default: true },
      imageUrl: { type: String }                    // optional
    },
    { timestamps: true }
  );

  const Vehicle = mongoose.model("Vehicle", vehicleSchema);
  export default Vehicle;
