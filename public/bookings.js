// --- Config ---
const API_URL = "https://vehicle-rental-vxjx.onrender.com/api";

// Detect which page we are on
const isSingleBookingPage = window.location.pathname.includes("booking.html");
const isAllBookingsPage = window.location.pathname.includes("bookings.html");

// ------------------- SINGLE BOOKING PAGE (booking.html) -------------------
if (isSingleBookingPage) {
  const params = new URLSearchParams(window.location.search);
  const vehicleId = params.get("vehicleId");

  console.log("VehicleId from URL:", vehicleId);

  if (!vehicleId) {
    alert("⚠️ No vehicle selected. Redirecting...");
    window.location.href = "index.html";
  }

  // ✅ Load vehicle details
  async function loadVehicle() {
    try {
      const res = await fetch(`${API_URL}/vehicles/${vehicleId}`);
      if (!res.ok) throw new Error("Failed to fetch vehicle");

      const vehicle = await res.json();
      console.log("Vehicle loaded:", vehicle);

      document.getElementById("vehicleName").textContent =
        `${vehicle.make} ${vehicle.model} (${vehicle.year})`;
      document.getElementById("vehicleImage").src = vehicle.imageUrl || "images/default.jpeg";
      document.getElementById("vehiclePrice").textContent =
        `Price: ₹${vehicle.pricePerDay}/day`;

      // store price in hidden field
      document.getElementById("totalPrice").value = vehicle.pricePerDay;
    } catch (err) {
      console.error("Error loading vehicle:", err);
      alert("❌ Failed to load vehicle details.");
      window.location.href = "index.html";
    }
  }

  // ✅ Handle booking form submit
  document.getElementById("bookingForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const bookingData = {
      vehicle: vehicleId, // backend expects field `vehicle`
      userName: this.fullname.value,
      userEmail: this.email.value,
      startDate: this.startdate.value,
      endDate: this.enddate.value,
      totalPrice: document.getElementById("totalPrice").value
    };

    try {
      const res = await fetch(`${API_URL}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData)
      });

      if (!res.ok) throw new Error("Booking failed");

      alert(`✅ Booking confirmed for ${bookingData.userName}`);
      window.location.href = "bookings.html";
    } catch (err) {
      console.error("Error booking:", err);
      alert("❌ Failed to create booking");
    }
  });

  loadVehicle();
}

// ------------------- ALL BOOKINGS PAGE (bookings.html) -------------------
if (isAllBookingsPage) {
  const API_URL = "https://vehicle-rental-vxjx.onrender.com/api";

async function loadBookings() {
  try {
    const res = await fetch(`${API_URL}/bookings`);
    const bookings = await res.json();

    const tbody = document.querySelector("#bookings-table tbody");
    tbody.innerHTML = "";

    if (bookings.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="color:red; text-align:center;">⚠️ No bookings found.</td></tr>`;
      return;
    }

    bookings.forEach(b => {
      tbody.innerHTML += `
        <tr>
          <td>${b.vehicle?.make} ${b.vehicle?.model}</td>
          <td>${b.userName}</td>
          <td>${b.userEmail}</td>
          <td>${new Date(b.startDate).toLocaleDateString()}</td>
          <td>${new Date(b.endDate).toLocaleDateString()}</td>
          <td>₹${b.totalPrice}</td>
        </tr>
      `;
    });
  } catch (err) {
    console.error("Error loading bookings:", err);
  }
}

loadBookings();

}
