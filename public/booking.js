// --- API Base URL ---
const API_URL = "https://vehicle-rental-vxjx.onrender.com/api";

// --- Extract vehicleId from URL ---
const params = new URLSearchParams(window.location.search);
const vehicleId = params.get("vehicleId");

console.log("VehicleId from URL:", vehicleId); // ✅ Debug log

// --- Validate vehicleId ---
if (!vehicleId || vehicleId === "null" || vehicleId === "undefined") {
  alert("⚠️ No vehicle selected. Redirecting to home...");
  console.error("Missing or invalid vehicleId in URL:", vehicleId);
  window.location.href = "index.html";
}

// --- Fetch vehicle details from backend ---
async function loadVehicle() {
  try {
    console.log("Fetching vehicle details for ID:", vehicleId);

    const res = await fetch(`${API_URL}/vehicles/${vehicleId}`);
    if (!res.ok) throw new Error(`Vehicle not found (status: ${res.status})`);

    const vehicle = await res.json();
    console.log("Vehicle loaded:", vehicle);

    // ✅ Ensure vehicle object has required fields
    if (!vehicle || !vehicle.make || !vehicle.model) {
      throw new Error("Invalid vehicle data received from backend");
    }

    // --- Update booking page with vehicle info ---
    document.getElementById("vehicleImage").src =
      vehicle.imageUrl || "images/default.jpeg";
    document.getElementById("vehicleImage").alt =
      `${vehicle.make} ${vehicle.model}`;
    document.getElementById("vehicleName").textContent =
      `${vehicle.make} ${vehicle.model} (${vehicle.year || "N/A"})`;
    document.getElementById("vehiclePrice").textContent =
      `Price: ₹${vehicle.pricePerDay || 0}/day`;

    // --- Store price in hidden field ---
    document.getElementById("totalPrice").value = vehicle.pricePerDay || 0;
  } catch (err) {
    console.error("❌ Error loading vehicle:", err.message);
    alert("❌ Failed to load vehicle details. Redirecting...");
    window.location.href = "index.html"; // fallback redirect
  }
}

// --- Handle booking form submit ---
document.getElementById("bookingForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const bookingData = {
    vehicle: vehicleId, // 👈 must match schema field "vehicle"
    userName: this.fullname.value,
    userEmail: this.email.value,
    startDate: this.startdate.value,
    endDate: this.enddate.value,
    totalPrice: Number(document.getElementById("totalPrice").value),
  };

  console.log("Submitting booking:", bookingData);

  try {
    const res = await fetch(`${API_URL}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData),
    });

    if (!res.ok) throw new Error(`Booking failed (status: ${res.status})`);

    alert(`✅ Booking confirmed for ${bookingData.userName}`);
    window.location.href = "bookings.html";
  } catch (err) {
    console.error("❌ Error booking:", err.message);
    alert("❌ Failed to create booking. Please try again.");
  }
});

// --- Load vehicle details on page load ---
loadVehicle();
