import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";

function Booking() {
  const location = useLocation();
  const navigate = useNavigate();

  // =====================================================
  // GET DATA FROM SEATS PAGE
  // =====================================================

  const bus = location.state?.bus;

  const selectedSeats =
    location.state?.selectedSeats || [];

  // =====================================================
  // GET SCHEDULE ID
  // =====================================================

  const scheduleId =
    location.state?.scheduleId ||
    bus?.schedule_id ||
    bus?.scheduleId;

  // =====================================================
  // PASSENGER STATE
  // =====================================================

  const [passenger, setPassenger] = useState({
    name: "",
    phone: "",
    email: ""
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // =====================================================
  // BUS NOT FOUND
  // =====================================================

  if (!bus) {
    return (
      <div style={styles.page}>
        <div style={styles.errorCard}>

          <h2>
            Bus not found
          </h2>

          <p>
            Please search for a bus and select seats first.
          </p>

          <button
            type="button"
            style={styles.button}
            onClick={() => navigate("/search")}
          >
            Back to Search
          </button>

        </div>
      </div>
    );
  }

  // =====================================================
  // SCHEDULE ID NOT FOUND
  // =====================================================

  if (!scheduleId) {
    return (
      <div style={styles.page}>
        <div style={styles.errorCard}>

          <h2>
            Schedule not found
          </h2>

          <p>
            This bus does not have a schedule ID.
          </p>

          <p>
            Please go back to search and select the bus again.
          </p>

          <button
            type="button"
            style={styles.button}
            onClick={() => navigate("/search")}
          >
            Back to Search
          </button>

        </div>
      </div>
    );
  }

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setPassenger((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  // =====================================================
  // PRICE
  // =====================================================

  const pricePerSeat = Number(
    bus.fare ||
    bus.price ||
    500
  );

  const totalPrice =
    selectedSeats.length * pricePerSeat;

  // =====================================================
  // HANDLE BOOKING
  // =====================================================

  const handleBooking = async (e) => {
    e.preventDefault();

    setError("");

    // ---------------------------------------------------
    // VALIDATION
    // ---------------------------------------------------

    if (!scheduleId) {
      setError(
        "Schedule ID is missing."
      );
      return;
    }

    if (selectedSeats.length === 0) {
      setError(
        "Please select at least one seat."
      );
      return;
    }

    if (!passenger.name.trim()) {
      setError(
        "Passenger name is required."
      );
      return;
    }

    if (!passenger.phone.trim()) {
      setError(
        "Passenger phone is required."
      );
      return;
    }

    if (!passenger.email.trim()) {
      setError(
        "Passenger email is required."
      );
      return;
    }

    // ---------------------------------------------------
    // START LOADING
    // ---------------------------------------------------

    setLoading(true);

    try {

      // =================================================
      // IMPORTANT
      // BACKEND EXPECTS scheduleId
      // NOT schedule_id
      // =================================================

      const bookingData = {

        scheduleId: Number(scheduleId),

        seats: selectedSeats,

        passenger_name:
          passenger.name.trim(),

        passenger_phone:
          passenger.phone.trim(),

        passenger_email:
          passenger.email.trim(),

        total_amount:
          totalPrice
      };

      // -------------------------------------------------
      // DEBUG
      // -------------------------------------------------

      console.log(
        "BOOKING REQUEST:",
        bookingData
      );

      console.log(
        "Schedule ID:",
        scheduleId
      );

      console.log(
        "Selected Seats:",
        selectedSeats
      );

      // -------------------------------------------------
      // API REQUEST
      // -------------------------------------------------

      const response = await api.post(
        "/bookings",
        bookingData
      );

      // -------------------------------------------------
      // SUCCESS RESPONSE
      // -------------------------------------------------

      console.log(
        "BOOKING RESPONSE:",
        response.data
      );

      // -------------------------------------------------
      // GO TO SUCCESS PAGE
      // -------------------------------------------------

      navigate(
        "/booking-success",
        {
          state: {
            booking:
              response.data.booking ||
              response.data,

            bus,

            selectedSeats,

            passenger,

            scheduleId
          }
        }
      );

    } catch (error) {

      // -------------------------------------------------
      // ERROR
      // -------------------------------------------------

      console.error(
        "Booking error:",
        error
      );

      console.error(
        "Backend response:",
        error.response?.data
      );

      setError(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Booking failed. Please try again."
      );

    } finally {

      setLoading(false);

    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div style={styles.page}>

      {/* =================================================
          HEADER
      ================================================= */}

      <div style={styles.header}>

        <button
          type="button"
          style={styles.backButton}
          onClick={() =>
            navigate(
              "/seats",
              {
                state: {
                  bus,
                  selectedSeats,
                  scheduleId
                }
              }
            )
          }
        >
          ← Back
        </button>

        <h1>
          Confirm Booking
        </h1>

      </div>


      {/* =================================================
          BUS INFORMATION
      ================================================= */}

      <div style={styles.card}>

        <h2>
          {bus.bus_name ||
            bus.name ||
            "Bus"}
        </h2>

        <div style={styles.infoGrid}>

          {/* BUS NUMBER */}

          <div style={styles.infoItem}>

            <strong>
              Bus Number
            </strong>

            <p>
              {bus.bus_number ||
                bus.busNumber ||
                "-"}
            </p>

          </div>


          {/* BUS TYPE */}

          <div style={styles.infoItem}>

            <strong>
              Bus Type
            </strong>

            <p>
              {bus.bus_type ||
                bus.busType ||
                "-"}
            </p>

          </div>


          {/* FROM */}

          <div style={styles.infoItem}>

            <strong>
              From
            </strong>

            <p>
              {bus.source ||
                bus.from ||
                "-"}
            </p>

          </div>


          {/* TO */}

          <div style={styles.infoItem}>

            <strong>
              To
            </strong>

            <p>
              {bus.destination ||
                bus.to ||
                "-"}
            </p>

          </div>


          {/* TRAVEL DATE */}

          <div style={styles.infoItem}>

            <strong>
              Travel Date
            </strong>

            <p>
              {bus.travel_date
                ? new Date(
                    bus.travel_date
                  ).toLocaleDateString()
                : "-"}
            </p>

          </div>


          {/* SCHEDULE ID */}

          <div style={styles.infoItem}>

            <strong>
              Schedule ID
            </strong>

            <p>
              {scheduleId}
            </p>

          </div>

        </div>

      </div>


      {/* =================================================
          SELECTED SEATS
      ================================================= */}

      <div style={styles.card}>

        <h2>
          Selected Seats
        </h2>

        {selectedSeats.length === 0 ? (

          <p>
            No seats selected.
          </p>

        ) : (

          <div style={styles.seats}>

            {selectedSeats.map(
              (seat) => (

                <span
                  key={seat}
                  style={styles.seat}
                >
                  Seat {seat}
                </span>

              )
            )}

          </div>

        )}

      </div>


      {/* =================================================
          PASSENGER FORM
      ================================================= */}

      <form
        onSubmit={handleBooking}
        style={styles.card}
      >

        <h2>
          Passenger Details
        </h2>


        {/* NAME */}

        <div style={styles.field}>

          <label>
            Passenger Name
          </label>

          <input
            style={styles.input}
            type="text"
            name="name"
            value={passenger.name}
            onChange={handleChange}
            placeholder="Enter passenger name"
            required
          />

        </div>


        {/* PHONE */}

        <div style={styles.field}>

          <label>
            Phone Number
          </label>

          <input
            style={styles.input}
            type="tel"
            name="phone"
            value={passenger.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
            required
          />

        </div>


        {/* EMAIL */}

        <div style={styles.field}>

          <label>
            Email
          </label>

          <input
            style={styles.input}
            type="email"
            name="email"
            value={passenger.email}
            onChange={handleChange}
            placeholder="Enter email"
            required
          />

        </div>


        {/* =================================================
            BOOKING SUMMARY
        ================================================= */}

        <div style={styles.summary}>

          {/* SCHEDULE ID */}

          <div style={styles.summaryRow}>

            <span>
              Schedule ID
            </span>

            <strong>
              {scheduleId}
            </strong>

          </div>


          {/* SELECTED SEATS */}

          <div style={styles.summaryRow}>

            <span>
              Selected Seats
            </span>

            <strong>
              {selectedSeats.join(", ")}
            </strong>

          </div>


          {/* NUMBER OF SEATS */}

          <div style={styles.summaryRow}>

            <span>
              Number of Seats
            </span>

            <strong>
              {selectedSeats.length}
            </strong>

          </div>


          {/* PRICE */}

          <div style={styles.summaryRow}>

            <span>
              Price / Seat
            </span>

            <strong>
              ₹{pricePerSeat}
            </strong>

          </div>


          <hr />


          {/* TOTAL */}

          <div style={styles.total}>

            <span>
              Total Amount
            </span>

            <strong>
              ₹{totalPrice}
            </strong>

          </div>

        </div>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (

          <div style={styles.error}>

            {error}

          </div>

        )}


        {/* =================================================
            CONFIRM BUTTON
        ================================================= */}

        <button
          type="submit"
          disabled={
            loading ||
            selectedSeats.length === 0
          }
          style={{
            ...styles.button,

            opacity:
              loading ||
              selectedSeats.length === 0
                ? 0.6
                : 1
          }}
        >

          {loading
            ? "Processing Booking..."
            : `Confirm Booking ₹${totalPrice}`}

        </button>

      </form>

    </div>
  );
}


// =====================================================
// STYLES
// =====================================================

const styles = {

  page: {
    minHeight: "100vh",
    background: "#f5f7fa",
    padding: "30px",
    boxSizing: "border-box"
  },


  header: {
    maxWidth: "900px",
    margin: "0 auto 25px",
    display: "flex",
    alignItems: "center",
    gap: "20px"
  },


  backButton: {
    padding: "10px 18px",
    border: "1px solid #1976d2",
    background: "white",
    color: "#1976d2",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px"
  },


  card: {
    maxWidth: "900px",
    margin: "0 auto 20px",
    padding: "25px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    background: "white",
    boxShadow:
      "0 2px 10px rgba(0,0,0,0.06)",
    boxSizing: "border-box"
  },


  infoGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, 1fr)",
    gap: "20px",
    marginTop: "20px"
  },


  infoItem: {
    padding: "10px",
    background: "#f8f9fa",
    borderRadius: "6px"
  },


  field: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "18px"
  },


  input: {
    width: "100%",
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "15px",
    boxSizing: "border-box"
  },


  seats: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap"
  },


  seat: {
    padding: "10px 15px",
    background: "#e3f2fd",
    border: "1px solid #1976d2",
    borderRadius: "6px",
    color: "#1976d2",
    fontWeight: "bold"
  },


  summary: {
    marginTop: "25px",
    padding: "20px",
    background: "#f8f9fa",
    borderRadius: "8px"
  },


  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "15px"
  },


  total: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "22px",
    marginTop: "20px"
  },


  button: {
    width: "100%",
    padding: "14px",
    border: "none",
    borderRadius: "7px",
    background: "#1976d2",
    color: "white",
    fontSize: "17px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "20px"
  },


  error: {
    padding: "12px",
    marginTop: "15px",
    marginBottom: "10px",
    background: "#ffebee",
    color: "#c62828",
    borderRadius: "6px",
    textAlign: "center",
    fontWeight: "500"
  },


  errorCard: {
    maxWidth: "500px",
    margin: "100px auto",
    padding: "40px",
    background: "white",
    borderRadius: "10px",
    textAlign: "center",
    boxShadow:
      "0 2px 10px rgba(0,0,0,0.08)"
  }

};

export default Booking;