// Detect which page we are on
const isSingleBookingPage = window.location.pathname.includes("booking.html");
const isAllBookingsPage = window.location.pathname.includes("bookings.html");

// ------------------- TOKEN HANDLER -------------------
function getToken() {
  return localStorage.getItem("token");
}

function checkAuth() {
  const token = getToken();
  if (!token) {
    alert("You must be logged in first.");
    window.location.href = "login.html";
  }
  return token;
}

// ------------------- SINGLE BOOKING PAGE (booking.html) -------------------
if (isSingleBookingPage) {
  const params = new URLSearchParams(window.location.search);
  const vehicleId = params.get("vehicleId");

  document.getElementById("bookingForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = checkAuth(); // Ensure user is logged in
    if (!token) return;

    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    const totalPrice = document.getElementById("totalPrice").value;

    try {
      const response = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          vehicleId,
          startDate,
          endDate,
          totalPrice
        })
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      alert("Booking created successfully!");
      window.location.href = "bookings.html"; // Redirect to all bookings page
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("Failed to create booking. Please try again.");
    }
  });
}

// ------------------- ALL BOOKINGS PAGE (bookings.html) -------------------
if (isAllBookingsPage) {
  async function fetchBookings() {
    const token = checkAuth(); // Ensure user is logged in
    if (!token) return;

    try {
      const response = await fetch("http://localhost:5000/api/bookings", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const bookings = await response.json();

      const bookingsList = document.getElementById("bookingsList");
      bookingsList.innerHTML = "";

      if (bookings.length === 0) {
        bookingsList.innerHTML = "<p>No bookings found.</p>";
        return;
      }

      bookings.forEach(booking => {
        const div = document.createElement("div");
        div.className = "booking-card";
        div.innerHTML = `
          <p><strong>Vehicle:</strong> ${booking.vehicle?.name || "N/A"}</p>
          <p><strong>Start Date:</strong> ${booking.startDate}</p>
          <p><strong>End Date:</strong> ${booking.endDate}</p>
          <p><strong>Total Price:</strong> ₹${booking.totalPrice}</p>
        `;
        bookingsList.appendChild(div);
      });
    } catch (error) {
      console.error("Error fetching bookings:", error);
      alert("Failed to load bookings.");
    }
  }

  fetchBookings();
}
