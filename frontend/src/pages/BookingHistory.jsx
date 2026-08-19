
import { useEffect, useState } from "react";
import api from "../services/api";

function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  // =====================================================
  // LOAD BOOKINGS
  // =====================================================

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await api.get("/bookings/my-bookings");

      console.log(
        "MY BOOKINGS:",
        response.data
      );

      const result =
        response.data.bookings ||
        response.data ||
        [];

      if (Array.isArray(result)) {
        setBookings(result);
      } else {
        setBookings([]);
      }

    } catch (error) {

      console.error(
        "BOOKING HISTORY ERROR:",
        error.response?.data ||
        error.message
      );

      setError(
        error.response?.data?.message ||
        "Failed to load booking history"
      );

    } finally {

      setLoading(false);

    }
  };


  // =====================================================
  // CANCEL BOOKING
  // DELETE /api/bookings/:bookingId
  // =====================================================

  const handleCancelBooking = async (booking) => {

    const bookingId =
      booking.booking_id ||
      booking.id;

    if (!bookingId) {
      alert("Invalid booking ID");
      return;
    }

    // ---------------------------------------------------
    // CHECK STATUS
    // ---------------------------------------------------

    const status =
      String(
        booking.status || ""
      ).toUpperCase();

    if (status !== "CONFIRMED") {
      alert(
        "Only confirmed bookings can be cancelled."
      );

      return;
    }


    // ---------------------------------------------------
    // CONFIRM CANCELLATION
    // ---------------------------------------------------

    const confirmed =
      window.confirm(
        `Are you sure you want to cancel booking ${
          booking.booking_reference ||
          booking.bookingReference ||
          bookingId
        }?`
      );

    if (!confirmed) {
      return;
    }


    try {

      // -------------------------------------------------
      // SHOW CANCELLING STATE
      // -------------------------------------------------

      setCancellingId(bookingId);
      setError("");


      // -------------------------------------------------
      // CALL BACKEND
      // -------------------------------------------------

      const response =
        await api.delete(
          `/bookings/${bookingId}`
        );


      console.log(
        "CANCEL BOOKING RESPONSE:",
        response.data
      );


      // -------------------------------------------------
      // SUCCESS MESSAGE
      // -------------------------------------------------

      alert(
        response.data?.message ||
        "Booking cancelled successfully"
      );


      // -------------------------------------------------
      // RELOAD BOOKINGS
      // -------------------------------------------------

      await loadBookings();


    } catch (error) {

      console.error(
        "CANCEL BOOKING ERROR:",
        error.response?.data ||
        error.message
      );


      // -------------------------------------------------
      // SHOW ERROR
      // -------------------------------------------------

      setError(
        error.response?.data?.message ||
        "Failed to cancel booking"
      );


    } finally {

      setCancellingId(null);

    }
  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div style={styles.page}>

        <h1>My Bookings</h1>

        <p>
          Loading bookings...
        </p>

      </div>
    );
  }


  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div style={styles.page}>

      <h1 style={styles.title}>
        My Bookings
      </h1>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div style={styles.error}>
          {error}
        </div>
      )}


      {/* =================================================
          EMPTY
      ================================================= */}

      {!error &&
        bookings.length === 0 && (
          <div style={styles.empty}>

            <h2>
              No bookings found
            </h2>

            <p>
              You have not made any bookings yet.
            </p>

          </div>
        )}


      {/* =================================================
          BOOKINGS
      ================================================= */}

      {bookings.map((booking) => {

        const bookingId =
          booking.booking_id ||
          booking.id;

        const bookingReference =
          booking.booking_reference ||
          booking.bookingReference ||
          "Booking";

        const status =
          String(
            booking.status || ""
          ).toUpperCase();

        const isConfirmed =
          status === "CONFIRMED";

        const isCancelled =
          status === "CANCELLED";

        const isCancelling =
          cancellingId === bookingId;


        return (
          <div
            key={bookingId}
            style={styles.card}
          >

            {/* =========================================
                BOOKING HEADER
            ========================================= */}

            <div style={styles.header}>

              <div>

                <h2 style={styles.bookingReference}>
                  {bookingReference}
                </h2>

                <p style={styles.bookingId}>
                  Booking ID: {bookingId || "-"}
                </p>

              </div>


              {/* STATUS */}
              <div
                style={{
                  ...styles.status,
                  ...(isConfirmed
                    ? styles.confirmed
                    : {}),
                  ...(isCancelled
                    ? styles.cancelled
                    : {})
                }}
              >
                {status || "UNKNOWN"}
              </div>

            </div>


            {/* =========================================
                BOOKING INFORMATION
            ========================================= */}

            <div style={styles.details}>

              <p>
                <strong>
                  Schedule ID:
                </strong>{" "}
                {booking.schedule_id ||
                  booking.scheduleId ||
                  "-"}
              </p>


              <p>
                <strong>
                  Travel Date:
                </strong>{" "}
                {booking.travel_date ||
                  booking.travelDate ||
                  "-"}
              </p>


              <p>
                <strong>
                  Departure:
                </strong>{" "}
                {booking.departure_time ||
                  booking.departureTime ||
                  "-"}
              </p>


              <p>
                <strong>
                  Arrival:
                </strong>{" "}
                {booking.arrival_time ||
                  booking.arrivalTime ||
                  "-"}
              </p>


              <p>
                <strong>
                  Bus:
                </strong>{" "}
                {booking.bus_name ||
                  booking.busName ||
                  "-"}
              </p>


              <p>
                <strong>
                  Bus Number:
                </strong>{" "}
                {booking.bus_number ||
                  booking.busNumber ||
                  "-"}
              </p>


              <p>
                <strong>
                  Bus Type:
                </strong>{" "}
                {booking.bus_type ||
                  booking.busType ||
                  "-"}
              </p>


              <p>
                <strong>
                  From:
                </strong>{" "}
                {booking.source ||
                  booking.from ||
                  "-"}
              </p>


              <p>
                <strong>
                  To:
                </strong>{" "}
                {booking.destination ||
                  booking.to ||
                  "-"}
              </p>


              <p>
                <strong>
                  Total Amount:
                </strong>{" "}
                ₹
                {booking.total_amount ??
                  booking.totalAmount ??
                  0}
              </p>

            </div>


            {/* =========================================
                SEATS
            ========================================= */}

            {Array.isArray(
              booking.seats
            ) &&
              booking.seats.length > 0 && (

                <div style={styles.seatsSection}>

                  <h3>
                    Seats
                  </h3>

                  <div style={styles.seats}>

                    {booking.seats.map(
                      (seat) => (

                        <div
                          key={
                            seat.seat_id
                          }
                          style={styles.seat}
                        >

                          <strong>
                            Seat{" "}
                            {seat.seat_number}
                          </strong>

                          <span>
                            {seat.seat_type ||
                              "Standard"}
                          </span>

                        </div>

                      )
                    )}

                  </div>

                </div>

              )}


            {/* =========================================
                CANCEL BUTTON
            ========================================= */}

            {isConfirmed && (

              <div style={styles.actions}>

                <button
                  type="button"
                  onClick={() =>
                    handleCancelBooking(
                      booking
                    )
                  }
                  disabled={isCancelling}
                  style={{
                    ...styles.cancelButton,
                    ...(isCancelling
                      ? styles.disabledButton
                      : {})
                  }}
                >

                  {isCancelling
                    ? "Cancelling..."
                    : "Cancel Ticket"}

                </button>

              </div>

            )}


            {/* =========================================
                CANCELLED MESSAGE
            ========================================= */}

            {isCancelled && (

              <div style={styles.cancelledMessage}>

                This booking has been
                cancelled.

              </div>

            )}

          </div>
        );
      })}

    </div>
  );
}


// =====================================================
// STYLES
// =====================================================

const styles = {

  page: {
    maxWidth: "1000px",
    margin: "40px auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif"
  },


  title: {
    marginBottom: "30px"
  },


  card: {
    padding: "25px",
    marginBottom: "25px",
    border: "1px solid #ddd",
    borderRadius: "12px",
    background: "#fff",
    boxShadow:
      "0 3px 10px rgba(0,0,0,0.08)"
  },


  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
    marginBottom: "20px",
    paddingBottom: "15px",
    borderBottom: "1px solid #eee"
  },


  bookingReference: {
    margin: "0 0 5px 0"
  },


  bookingId: {
    margin: 0,
    color: "#666"
  },


  status: {
    padding: "8px 14px",
    borderRadius: "20px",
    fontWeight: "bold",
    fontSize: "14px",
    background: "#eee"
  },


  confirmed: {
    background: "#dff7e5",
    color: "#16833b"
  },


  cancelled: {
    background: "#ffe0e0",
    color: "#c62828"
  },


  details: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "8px 25px",
    marginBottom: "20px"
  },


  detailsParagraph: {
    margin: 0
  },


  seatsSection: {
    marginTop: "20px",
    paddingTop: "15px",
    borderTop: "1px solid #eee"
  },


  seats: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px"
  },


  seat: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    padding: "10px 15px",
    borderRadius: "8px",
    background: "#f3f6f9",
    border: "1px solid #ddd"
  },


  actions: {
    marginTop: "25px",
    paddingTop: "20px",
    borderTop: "1px solid #eee"
  },


  cancelButton: {
    padding: "11px 20px",
    border: "none",
    borderRadius: "7px",
    background: "#d32f2f",
    color: "#fff",
    fontSize: "15px",
    fontWeight: "bold",
    cursor: "pointer"
  },


  disabledButton: {
    opacity: 0.6,
    cursor: "not-allowed"
  },


  cancelledMessage: {
    marginTop: "20px",
    padding: "12px",
    borderRadius: "7px",
    background: "#fff0f0",
    color: "#c62828",
    fontWeight: "bold"
  },


  error: {
    padding: "15px",
    marginBottom: "20px",
    color: "#b71c1c",
    background: "#ffecec",
    borderRadius: "8px"
  },


  empty: {
    padding: "30px",
    textAlign: "center",
    background: "#f5f5f5",
    borderRadius: "10px"
  }

};


export default BookingHistory;
