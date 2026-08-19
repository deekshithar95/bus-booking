import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

function Seats() {
  const location = useLocation();
  const navigate = useNavigate();

  const bus = location.state?.bus;

  // Get schedule ID from navigation state first,
  // then from the bus object.
  const scheduleId =
    location.state?.scheduleId ??
    bus?.schedule_id ??
    bus?.scheduleId;

  const [selectedSeats, setSelectedSeats] = useState([]);

  // --------------------------------------------------
  // NO BUS
  // --------------------------------------------------

  if (!bus) {
    return (
      <div style={styles.page}>
        <div style={styles.errorBox}>
          <h2>No bus selected</h2>

          <p>
            Please search for a bus first and select a bus.
          </p>

          <button
            type="button"
            style={styles.primaryButton}
            onClick={() => navigate("/search")}
          >
            Search Buses
          </button>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // NO SCHEDULE
  // --------------------------------------------------

  if (
    scheduleId === undefined ||
    scheduleId === null ||
    Number.isNaN(Number(scheduleId))
  ) {
    return (
      <div style={styles.page}>
        <div style={styles.errorBox}>
          <h2>Schedule ID not found</h2>

          <p>
            This bus does not contain a valid schedule ID.
          </p>

          <button
            type="button"
            style={styles.primaryButton}
            onClick={() => navigate("/search")}
          >
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // SEATS
  // --------------------------------------------------

  const totalSeats = Number(
    bus.total_seats ??
    bus.totalSeats ??
    40
  );

  const seats = Array.from(
    { length: totalSeats },
    (_, index) => index + 1
  );

  // --------------------------------------------------
  // TOGGLE SEAT
  // --------------------------------------------------

  const toggleSeat = (seatNumber) => {
    setSelectedSeats((previousSeats) => {
      if (previousSeats.includes(seatNumber)) {
        return previousSeats.filter(
          (seat) => seat !== seatNumber
        );
      }

      return [
        ...previousSeats,
        seatNumber
      ];
    });
  };

  // --------------------------------------------------
  // CONTINUE BOOKING
  // --------------------------------------------------

  const continueBooking = () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat.");
      return;
    }

    const numericScheduleId = Number(scheduleId);

    const numericSeats = selectedSeats.map(
      (seat) => Number(seat)
    );

    const bookingState = {
      bus,
      scheduleId: numericScheduleId,
      selectedSeats: numericSeats,
      travelDate:
        location.state?.travelDate ??
        bus.travel_date,
      from:
        location.state?.from ??
        bus.source,
      to:
        location.state?.to ??
        bus.destination
    };

    console.log(
      "CONTINUE BOOKING:",
      bookingState
    );

    navigate("/booking", {
      state: bookingState
    });
  };

  // --------------------------------------------------
  // PRICE
  // --------------------------------------------------

  const pricePerSeat = Number(
    bus.fare ??
    bus.price ??
    500
  );

  const totalAmount =
    selectedSeats.length * pricePerSeat;

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div style={styles.page}>

      {/* HEADER */}

      <div style={styles.header}>

        <button
          type="button"
          style={styles.backButton}
          onClick={() => navigate("/search")}
        >
          ← Back
        </button>

        <h1>
          Select Your Seat
        </h1>

        <div />
      </div>


      {/* BUS INFORMATION */}

      <div style={styles.busInfo}>

        <div>

          <h2>
            {bus.bus_name ||
              bus.name ||
              "Bus"}
          </h2>

          <p>
            <strong>Bus Number:</strong>{" "}
            {bus.bus_number ||
              bus.busNumber ||
              "-"}
          </p>

        </div>


        <div>

          <p>
            <strong>From:</strong>{" "}
            {bus.source ||
              bus.from ||
              "-"}
          </p>

          <p>
            <strong>To:</strong>{" "}
            {bus.destination ||
              bus.to ||
              "-"}
          </p>

        </div>


        <div>

          <p>
            <strong>Schedule ID:</strong>{" "}
            {Number(scheduleId)}
          </p>

          <p>
            <strong>Fare:</strong>{" "}
            ₹{pricePerSeat}
          </p>

        </div>

      </div>


      {/* CONTENT */}

      <div style={styles.content}>

        {/* SEAT SECTION */}

        <div style={styles.seatSection}>

          <h2>
            Available Seats
          </h2>

          <div style={styles.bus}>

            {/* DRIVER */}

            <div style={styles.driver}>
              🚍 Driver
            </div>


            {/* SEAT GRID */}

            <div style={styles.seatGrid}>

              {seats.map((seatNumber) => {

                const isSelected =
                  selectedSeats.includes(
                    seatNumber
                  );

                return (
                  <button
                    key={seatNumber}
                    type="button"
                    onClick={() =>
                      toggleSeat(
                        seatNumber
                      )
                    }
                    style={{
                      ...styles.seat,

                      ...(isSelected
                        ? styles.selectedSeat
                        : {})
                    }}
                  >
                    {seatNumber}
                  </button>
                );

              })}

            </div>

          </div>


          {/* LEGEND */}

          <div style={styles.legend}>

            <div style={styles.legendItem}>

              <span
                style={{
                  ...styles.legendSeat,
                  background: "#ffffff"
                }}
              />

              Available

            </div>


            <div style={styles.legendItem}>

              <span
                style={{
                  ...styles.legendSeat,
                  background: "#1976d2"
                }}
              />

              Selected

            </div>


            <div style={styles.legendItem}>

              <span
                style={{
                  ...styles.legendSeat,
                  background: "#cccccc"
                }}
              />

              Booked

            </div>

          </div>

        </div>


        {/* SUMMARY */}

        <div style={styles.summary}>

          <h2>
            Booking Summary
          </h2>


          <div style={styles.summaryRow}>

            <span>
              Bus
            </span>

            <strong>
              {bus.bus_name ||
                bus.name ||
                "-"}
            </strong>

          </div>


          <div style={styles.summaryRow}>

            <span>
              Bus Number
            </span>

            <strong>
              {bus.bus_number ||
                bus.busNumber ||
                "-"}
            </strong>

          </div>


          <div style={styles.summaryRow}>

            <span>
              Schedule ID
            </span>

            <strong>
              {Number(scheduleId)}
            </strong>

          </div>


          <div style={styles.summaryRow}>

            <span>
              Selected Seats
            </span>

            <strong>
              {selectedSeats.length > 0
                ? selectedSeats.join(", ")
                : "None"}
            </strong>

          </div>


          <div style={styles.summaryRow}>

            <span>
              Number of Seats
            </span>

            <strong>
              {selectedSeats.length}
            </strong>

          </div>


          <div style={styles.summaryRow}>

            <span>
              Price / Seat
            </span>

            <strong>
              ₹{pricePerSeat}
            </strong>

          </div>


          <hr />


          <div style={styles.total}>

            <span>
              Total
            </span>

            <strong>
              ₹{totalAmount}
            </strong>

          </div>


          <button
            type="button"
            style={{
              ...styles.continueButton,

              opacity:
                selectedSeats.length === 0
                  ? 0.5
                  : 1
            }}
            disabled={
              selectedSeats.length === 0
            }
            onClick={continueBooking}
          >
            Continue Booking
          </button>

        </div>

      </div>

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
    maxWidth: "1100px",
    margin: "0 auto 25px",
    display: "grid",
    gridTemplateColumns: "1fr 2fr 1fr",
    alignItems: "center"
  },

  headerTitle: {
    textAlign: "center"
  },

  backButton: {
    width: "100px",
    padding: "10px",
    border: "1px solid #1976d2",
    background: "white",
    color: "#1976d2",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px"
  },

  busInfo: {
    maxWidth: "1100px",
    margin: "0 auto 25px",
    padding: "20px",
    background: "white",
    borderRadius: "10px",
    display: "flex",
    justifyContent: "space-between",
    gap: "30px",
    flexWrap: "wrap",
    boxShadow:
      "0 2px 10px rgba(0,0,0,0.08)"
  },

  content: {
    maxWidth: "1100px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "25px",
    alignItems: "start"
  },

  seatSection: {
    background: "white",
    padding: "25px",
    borderRadius: "10px",
    boxShadow:
      "0 2px 10px rgba(0,0,0,0.08)"
  },

  bus: {
    maxWidth: "400px",
    margin: "20px auto",
    padding: "25px",
    border: "3px solid #333",
    borderRadius: "25px",
    background: "#f9f9f9"
  },

  driver: {
    textAlign: "center",
    padding: "12px",
    marginBottom: "25px",
    background: "#eeeeee",
    borderRadius: "8px",
    fontWeight: "bold"
  },

  seatGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, 1fr)",
    gap: "15px"
  },

  seat: {
    height: "50px",
    border: "2px solid #1976d2",
    background: "white",
    color: "#1976d2",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "15px"
  },

  selectedSeat: {
    background: "#1976d2",
    color: "white"
  },

  legend: {
    display: "flex",
    justifyContent: "center",
    gap: "25px",
    marginTop: "25px",
    flexWrap: "wrap"
  },

  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "7px"
  },

  legendSeat: {
    width: "20px",
    height: "20px",
    border: "1px solid #999",
    borderRadius: "4px",
    display: "inline-block"
  },

  summary: {
    background: "white",
    padding: "25px",
    borderRadius: "10px",
    boxShadow:
      "0 2px 10px rgba(0,0,0,0.08)"
  },

  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "15px",
    marginBottom: "18px"
  },

  total: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "22px",
    marginTop: "20px",
    marginBottom: "20px"
  },

  continueButton: {
    width: "100%",
    padding: "14px",
    background: "#1976d2",
    color: "white",
    border: "none",
    borderRadius: "7px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold"
  },

  errorBox: {
    maxWidth: "500px",
    margin: "100px auto",
    padding: "40px",
    background: "white",
    borderRadius: "10px",
    textAlign: "center",
    boxShadow:
      "0 2px 10px rgba(0,0,0,0.08)"
  },

  primaryButton: {
    padding: "12px 25px",
    background: "#1976d2",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  }

};

export default Seats;