let vehicles = []; // will hold vehicles from backend
const API_URL = "https://vehicle-rental-vxjx.onrender.com/api";

// Fetch vehicles from backend API
async function loadVehicles() {
  try {
    const res = await fetch(`${API_URL}/vehicles`);
    if (!res.ok) throw new Error("Failed to fetch vehicles");

    vehicles = await res.json(); // store in global variable
    displayVehicles(vehicles);
  } catch (err) {
    console.error("Error loading vehicles:", err);
    document.getElementById("vehicleList").innerHTML =
      "<p>❌ Failed to load vehicles.</p>";
  }
}

// Display vehicles in UI
function displayVehicles(list) {
  const container = document.getElementById("vehicleList");
  container.innerHTML = "";

  list.forEach((vehicle) => {
    if (!vehicle.available) return; // hide unavailable vehicles

    container.innerHTML += `
      <div class="vehicle-card">
        <img src="${vehicle.imageUrl || "images/default.jpeg"}" alt="${vehicle.make} ${vehicle.model}">
        <h3>${vehicle.make} ${vehicle.model} (${vehicle.year})</h3>
        <p>₹${vehicle.pricePerDay}/day</p>
        <button onclick="bookVehicle('${vehicle._id}')">Book Now</button>
      </div>
    `;
  });
}

// Filter vehicles by search
function filterVehicles() {
  const searchText = document.getElementById("searchBox").value.trim().toLowerCase();

  const filtered = vehicles.filter((v) =>
    (v.make?.toLowerCase().includes(searchText) ||
     v.model?.toLowerCase().includes(searchText))
  );

  displayVehicles(filtered);
}

// Redirect to booking page with selected vehicleId
function bookVehicle(vehicleId) {
  window.location.href = `booking.html?vehicleId=${encodeURIComponent(vehicleId)}`;
}

// Event listeners
document.getElementById("searchBox").addEventListener("input", filterVehicles);

// Load vehicles on page load
loadVehicles();
