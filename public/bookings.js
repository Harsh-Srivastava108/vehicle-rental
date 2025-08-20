// bookings.js
const API_URL = "http://localhost:5000/api"; // change if your backend runs elsewhere

// Detect which page we are on
const isSingleBookingPage = window.location.pathname.includes("booking.html");
const isAllBookingsPage = window.location.pathname.includes("bookings.html");

// ------------------- SINGLE BOOKING PAGE (booking.html) -------------------
if (isSingleBookingPage) {
  const params = new URLSearchParams(window.location.search);
  const vehicleId = params.get("vehicleId");

  // Handle booking form submit
  document.getElementById("bookingForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const token = localStorage.getItem("token"); // get token
    if (!token) {
      alert("⚠️ You must be logged in to make a booking.");
      window.location.href = "login.html";
      return;
    }

    const bookingData = {
      vehicle: vehicleId,
      userName: this.fullname.value,
      userEmail: this.email.value,
      startDate: this.startdate.value,
      endDate: this.enddate.value,
      totalPrice: document.getElementById("totalPrice").value
    };

    try {
      const res = await fetch(`${API_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // ✅ send token
        },
        body: JSON.stringify(bookingData)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Booking failed");
      }

      alert(`✅ Booking confirmed for ${bookingData.userName}`);
      window.location.href = "bookings.html";
    } catch (err) {
      console.error("Error booking:", err);
      alert("❌ Failed to create booking");
    }
  });
}

// ------------------- ALL BOOKINGS PAGE (bookings.html) -------------------
if (isAllBookingsPage) {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("⚠️ Please log in first.");
    window.location.href = "login.html";
  } else {
    fetchBookings(token);
  }

  async function fetchBookings(token) {
    try {
      const res = await fetch(`${API_URL}/bookings`, {
        headers: { "Authorization": `Bearer ${token}` } // ✅ send token
      });

      if (!res.ok) throw new Error("Failed to fetch bookings");

      const bookings = await res.json();
      const bookingsList = document.getElementById("bookingsList");
      bookingsList.innerHTML = "";

      if (bookings.length === 0) {
        bookingsList.innerHTML = "<p>No bookings found.</p>";
        return;
      }

      bookings.forEach(b => {
        const div = document.createElement("div");
        div.className = "booking-card";
        div.innerHTML = `
          <h3>${b.vehicle?.brand || "Unknown Vehicle"} - ${b.vehicle?.model || ""}</h3>
          <p><strong>Name:</strong> ${b.userName}</p>
          <p><strong>Email:</strong> ${b.userEmail}</p>
          <p><strong>Start:</strong> ${new Date(b.startDate).toLocaleDateString()}</p>
          <p><strong>End:</strong> ${new Date(b.endDate).toLocaleDateString()}</p>
          <p><strong>Total Price:</strong> ₹${b.totalPrice}</p>
        `;
        bookingsList.appendChild(div);
      });
    } catch (err) {
      console.error("Error fetching bookings:", err);
      document.getElementById("bookingsList").innerHTML = "<p>❌ Failed to load bookings.</p>";
    }
  }
}
