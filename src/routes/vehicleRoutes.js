  // src/routes/vehicleRoutes.js
  import express from "express";
  import Vehicle from "../models/vehicle.js";

  const router = express.Router();

  // ✅ GET all vehicles
  router.get("/", async (req, res) => {
    try {
      const vehicles = await Vehicle.find();
      res.json(vehicles);
    } catch (err) {
      console.error("Error fetching vehicles:", err);
      res.status(500).json({ message: "Server Error" });
    }
  });

  // 📌 GET single vehicle by ID
  router.get("/:id", async (req, res) => {
    try {
      const vehicle = await Vehicle.findById(req.params.id);
      if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }
      res.json(vehicle);
    } catch (err) {
      console.error("Error fetching vehicle:", err);
      res.status(500).json({ message: "Server Error" });
    }
  });

  // ✅ GET a single vehicle by ID
  router.get("/:id", async (req, res) => {
    try {
      const vehicle = await Vehicle.findById(req.params.id);
      if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }
      res.json(vehicle);
    } catch (err) {
      console.error("Error fetching vehicle:", err);
      res.status(500).json({ message: "Server Error" });
    }
  });

  

// POST a new vehicle
router.post("/", async (req, res) => {
  try {
    const { make, model, year, pricePerDay, available, imageUrl } = req.body;

    if (!make || !model || !year || !pricePerDay) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const vehicle = new Vehicle({
      make,
      model,
      year,
      pricePerDay,
      available: available ?? true,
      imageUrl
    });

    const savedVehicle = await vehicle.save();
    res.status(201).json(savedVehicle);
  } catch (err) {
    console.error("Error creating vehicle:", err);
    res.status(400).json({ message: "Bad Request" });
  }
});

  // ✅ PUT update vehicle by ID
  router.put("/:id", async (req, res) => {
    try {
      const updatedVehicle = await Vehicle.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!updatedVehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }
      res.json(updatedVehicle);
    } catch (err) {
      console.error("Error updating vehicle:", err);
      res.status(400).json({ message: "Bad Request" });
    }
  });

  // ✅ DELETE vehicle by ID
  router.delete("/:id", async (req, res) => {
    try {
      const deletedVehicle = await Vehicle.findByIdAndDelete(req.params.id);
      if (!deletedVehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }
      res.json({ message: "Vehicle deleted successfully" });
    } catch (err) {
      console.error("Error deleting vehicle:", err);
      res.status(500).json({ message: "Server Error" });
    }
  });

  export default router;
