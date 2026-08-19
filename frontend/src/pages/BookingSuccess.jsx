import { useLocation, useNavigate } from "react-router-dom";

function BookingSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  const booking = location.state?.booking;
  const bus = location.state?.bus;
  const selectedSeats = location.state?.selectedSeats || [];
  const passenger = location.state?.passenger;
  const scheduleId = location.state?.scheduleId;

  if (!booking) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <h2>Booking information not found</h2>

          <p>
            Your booking may have been completed, but the booking
            details are not available on this page.
          </p>

          <button
            type="button"
            style={styles.button}
            onClick={() => navigate("/")}
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        <div style={styles.successIcon}>
          ✓
        </div>

        <h1 style={styles.title}>
          Booking Confirmed!
        </h1>

        <p style={styles.message}>
          Your bus ticket has been booked successfully.
        </p>

        <div style={styles.bookingReference}>
          <span>Booking Reference</span>

          <strong>
            {booking.bookingReference ||
              booking.booking_reference ||
              "-"}
          </strong>
        </div>

        <div style={styles.section}>
          <h2>Booking Details</h2>

          <div style={styles.row}>
            <span>Schedule ID</span>
            <strong>{scheduleId || booking.scheduleId || "-"}</strong>
          </div>

          <div style={styles.row}>
            <span>Bus</span>
            <strong>
              {bus?.bus_name ||
                bus?.name ||
                "-"}
            </strong>
          </div>

          <div style={styles.row}>
            <span>Bus Number</span>
            <strong>
              {bus?.bus_number ||
                bus?.busNumber ||
                "-"}
            </strong>
          </div>

          <div style={styles.row}>
            <span>From</span>
            <strong>
              {bus?.source ||
                bus?.from ||
                "-"}
            </strong>
          </div>

          <div style={styles.row}>
            <span>To</span>
            <strong>
              {bus?.destination ||
                bus?.to ||
                "-"}
            </strong>
          </div>

          <div style={styles.row}>
            <span>Seats</span>
            <strong>
              {selectedSeats.length > 0
                ? selectedSeats.join(", ")
                : "-"}
            </strong>
          </div>

          <div style={styles.row}>
            <span>Number of Seats</span>
            <strong>
              {selectedSeats.length}
            </strong>
          </div>

          <div style={styles.row}>
            <span>Status</span>
            <strong style={styles.confirmed}>
              {booking.status || "CONFIRMED"}
            </strong>
          </div>

          <div style={styles.totalRow}>
            <span>Total Amount</span>

            <strong>
              ₹{booking.totalAmount ||
                booking.total_amount ||
                0}
            </strong>
          </div>
        </div>

        {passenger && (
          <div style={styles.section}>
            <h2>Passenger Details</h2>

            <div style={styles.row}>
              <span>Name</span>
              <strong>{passenger.name}</strong>
            </div>

            <div style={styles.row}>
              <span>Phone</span>
              <strong>{passenger.phone}</strong>
            </div>

            <div style={styles.row}>
              <span>Email</span>
              <strong>{passenger.email}</strong>
            </div>
          </div>
        )}

        <button
          type="button"
          style={styles.button}
          onClick={() => navigate("/")}
        >
          Back to Home
        </button>

        <button
          type="button"
          style={styles.secondaryButton}
          onClick={() => navigate("/search")}
        >
          Book Another Ticket
        </button>

      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f7fa",
    padding: "40px 20px",
    boxSizing: "border-box"
  },

  card: {
    maxWidth: "700px",
    margin: "0 auto",
    background: "white",
    padding: "35px",
    borderRadius: "12px",
    boxShadow: "0 3px 15px rgba(0,0,0,0.08)"
  },

  successIcon: {
    width: "70px",
    height: "70px",
    margin: "0 auto 20px",
    borderRadius: "50%",
    background: "#2e7d32",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "40px",
    fontWeight: "bold"
  },

  title: {
    textAlign: "center",
    marginBottom: "10px"
  },

  message: {
    textAlign: "center",
    color: "#666",
    marginBottom: "30px"
  },

  bookingReference: {
    padding: "18px",
    background: "#e8f5e9",
    borderRadius: "8px",
    textAlign: "center",
    marginBottom: "25px"
  },

  section: {
    padding: "20px",
    background: "#f8f9fa",
    borderRadius: "8px",
    marginBottom: "20px"
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    padding: "10px 0",
    borderBottom: "1px solid #ddd"
  },

  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
    fontSize: "21px"
  },

  confirmed: {
    color: "#2e7d32"
  },

  button: {
    width: "100%",
    padding: "14px",
    border: "none",
    borderRadius: "7px",
    background: "#1976d2",
    color: "white",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "10px"
  },

  secondaryButton: {
    width: "100%",
    padding: "14px",
    border: "1px solid #1976d2",
    borderRadius: "7px",
    background: "white",
    color: "#1976d2",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "10px"
  }
};

export default BookingSuccess;