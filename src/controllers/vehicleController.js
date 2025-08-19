import Vehicle from "../models/vehicle.js";


export const getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// @desc    Add a new vehicle
// @route   POST /api/vehicles
export const addVehicle = async (req, res) => {
  try {
    const newVehicle = new Vehicle(req.body);
    await newVehicle.save();
    res.status(201).json(newVehicle);
  } catch (error) {
    res.status(400).json({ message: "Invalid vehicle data", error });
  }
};
