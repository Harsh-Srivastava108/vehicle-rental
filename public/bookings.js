// Detect which page we are on
const isSingleBookingPage = window.location.pathname.includes("booking.html");
const isAllBookingsPage = window.location.pathname.includes("bookings.html");

// ✅ Backend base URL
const API_BASE = "https://vehicle-rental-vxjx.onrender.com/api";

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
      const res = await fetch(`${API_BASE}/vehicles/${vehicleId}`);
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
      vehicleId,
      userName: this.fullname.value,
      userEmail: this.email.value,
      startDate: this.startdate.value,
      endDate: this.enddate.value,
      totalPrice: document.getElementById("totalPrice").value
    };

    try {
      const res = await fetch(`${API_BASE}/bookings`, {
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
  async function loadBookings() {
    try {
      const res = await fetch(`${API_BASE}/bookings`);
      if (!res.ok) throw new Error("Failed to fetch bookings");

      const bookings = await res.json();
      console.log("Bookings loaded:", bookings);

      const tableBody = document.querySelector("#bookingsTable tbody");
      tableBody.innerHTML = "";

      if (bookings.length === 0) {
        document.getElementById("noBookings").style.display = "block";
        return;
      }

      for (const booking of bookings) {
        const vehicleInfo = booking.vehicle
          ? `${booking.vehicle.make} ${booking.vehicle.model} (${booking.vehicle.year})`
          : "Unknown Vehicle";

        const row = `
          <tr>
            <td>${vehicleInfo}</td>
            <td>${booking.userName}</td>
            <td>${booking.userEmail}</td>
            <td>${new Date(booking.startDate).toLocaleDateString()}</td>
            <td>${new Date(booking.endDate).toLocaleDateString()}</td>
            <td>₹${booking.totalPrice}</td>
          </tr>
        `;
        tableBody.insertAdjacentHTML("beforeend", row);
      }
    } catch (err) {
      console.error("Error loading bookings:", err);
      document.getElementById("noBookings").style.display = "block";
    }
  }

  loadBookings();
}
