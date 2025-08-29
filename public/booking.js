
const params = new URLSearchParams(window.location.search);
const vehicleId = params.get("vehicleId");

if (!vehicleId || vehicleId === "null" || vehicleId === "undefined") {
  alert("⚠️ No vehicle selected. Redirecting...");
  window.location.href = "index.html";
}

async function loadVehicle() {
  try {
    const res = await fetch(`/api/vehicles/${vehicleId}`);
    if (!res.ok) throw new Error("Failed to fetch vehicle");
    const vehicle = await res.json();

    document.getElementById("vehicleDetails").innerHTML = `
      <div class="vehicle-card">
        <img src="${vehicle.imageUrl || "images/default.jpeg"}" alt="${vehicle.make} ${vehicle.model}">
        <h2>${vehicle.make} ${vehicle.model} (${vehicle.year})</h2>
        <p><strong>Price:</strong> ₹${vehicle.pricePerDay}/day</p>
        <p><strong>Status:</strong> ${vehicle.available ? "✅ Available" : "❌ Not Available"}</p>
      </div>
    `;

    window.selectedVehicle = vehicle;
  } catch (err) {
    console.error("Error loading vehicle:", err);
    document.getElementById("vehicleDetails").innerHTML =
      "<p>❌ Failed to load vehicle details.</p>";
  }
}

async function submitBooking(event) {
  event.preventDefault();

  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;

  if (!startDate || !endDate) {
    alert("Please select both start and end dates.");
    return;
  }

  if (new Date(startDate) > new Date(endDate)) {
    alert("End date must be after start date.");
    return;
  }

  const bookingData = {
    vehicle: vehicleId,
    startDate,
    endDate,
  };

  try {
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData),
    });

    const result = await res.json();

    if (res.ok) {
      alert("✅ Booking successful!");
      window.location.href = "bookings.html"; 
    } else {
      alert("❌ Booking failed: " + (result.error || "Unknown error"));
    }
  } catch (err) {
    console.error("Error submitting booking:", err);
    alert("❌ Booking failed. Please try again later.");
  }
}

document.getElementById("bookingForm")?.addEventListener("submit", submitBooking);

loadVehicle();
