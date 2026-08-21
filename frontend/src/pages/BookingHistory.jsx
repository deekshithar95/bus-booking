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
  // =====================================================

  const handleCancelBooking = async (booking) => {

    const bookingId =
      booking.booking_id ||
      booking.id;

    if (!bookingId) {
      alert("Invalid booking ID");
      return;
    }

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

      setCancellingId(bookingId);
      setError("");

      const response =
        await api.delete(
          `/bookings/${bookingId}`
        );

      console.log(
        "CANCEL BOOKING RESPONSE:",
        response.data
      );

      alert(
        response.data?.message ||
        "Booking cancelled successfully"
      );

      await loadBookings();

    } catch (error) {

      console.error(
        "CANCEL BOOKING ERROR:",
        error.response?.data ||
        error.message
      );

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

      <div style={styles.loadingPage}>

        <div style={styles.loader}></div>

        <h2 style={styles.loadingTitle}>
          Loading Your Bookings
        </h2>

        <p style={styles.loadingText}>
          Please wait while we fetch your tickets...
        </p>

      </div>

    );
  }


  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {

    if (!date) {
      return "-";
    }

    try {

      return new Date(date).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric"
        }
      );

    } catch {

      return date;

    }
  };


  // =====================================================
  // PAGE
  // =====================================================

  return (

    <div style={styles.page}>

      {/* =================================================
          HERO HEADER
      ================================================= */}

      <div style={styles.hero}>

        <div style={styles.heroIcon}>
          🎫
        </div>

        <div>

          <h1 style={styles.title}>
            My Bookings
          </h1>

          <p style={styles.subtitle}>
            Manage your bus tickets and travel details
          </p>

        </div>

        <div style={styles.bookingCount}>

          <span style={styles.countNumber}>
            {bookings.length}
          </span>

          <span style={styles.countLabel}>
            {bookings.length === 1
              ? "Booking"
              : "Bookings"}
          </span>

        </div>

      </div>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <div style={styles.error}>

          <span style={styles.errorIcon}>
            ⚠
          </span>

          <span>
            {error}
          </span>

        </div>

      )}


      {/* =================================================
          EMPTY STATE
      ================================================= */}

      {!error &&
        bookings.length === 0 && (

          <div style={styles.empty}>

            <div style={styles.emptyIcon}>
              🚌
            </div>

            <h2 style={styles.emptyTitle}>
              No Bookings Yet
            </h2>

            <p style={styles.emptyText}>
              You haven't booked any bus tickets yet.
              Your upcoming trips will appear here.
            </p>

            <button
              style={styles.searchButton}
              onClick={() =>
                window.location.href = "/search"
              }
            >
              🔍 Search Buses
            </button>

          </div>

        )}


      {/* =================================================
          BOOKINGS
      ================================================= */}

      <div style={styles.bookingList}>

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

          const scheduleId =
            booking.schedule_id ||
            booking.scheduleId ||
            "-";

          const travelDate =
            booking.travel_date ||
            booking.travelDate;

          const departure =
            booking.departure_time ||
            booking.departureTime ||
            "-";

          const arrival =
            booking.arrival_time ||
            booking.arrivalTime ||
            "-";

          const busName =
            booking.bus_name ||
            booking.busName ||
            "Bus";

          const busNumber =
            booking.bus_number ||
            booking.busNumber ||
            "-";

          const busType =
            booking.bus_type ||
            booking.busType ||
            "Standard";

          const source =
            booking.source ||
            booking.from ||
            "-";

          const destination =
            booking.destination ||
            booking.to ||
            "-";

          const totalAmount =
            booking.total_amount ??
            booking.totalAmount ??
            0;

          return (

            <div
              key={bookingId}
              style={{
                ...styles.card,

                ...(isCancelled
                  ? styles.cancelledCard
                  : {})
              }}
            >

              {/* =========================================
                  TICKET TOP
              ========================================= */}

              <div style={styles.ticketTop}>

                <div style={styles.bookingInfo}>

                  <div style={styles.ticketIcon}>
                    🚌
                  </div>

                  <div>

                    <span style={styles.smallLabel}>
                      BOOKING REFERENCE
                    </span>

                    <h2 style={styles.bookingReference}>
                      {bookingReference}
                    </h2>

                    <span style={styles.bookingId}>
                      Booking ID: #{bookingId}
                    </span>

                  </div>

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

                  <span>
                    {isConfirmed
                      ? "✓"
                      : isCancelled
                      ? "✕"
                      : "•"}
                  </span>

                  {status || "UNKNOWN"}

                </div>

              </div>


              {/* =========================================
                  DASHED SEPARATOR
              ========================================= */}

              <div style={styles.separator}>
                <span style={styles.cutoutLeft}></span>
                <div style={styles.dashedLine}></div>
                <span style={styles.cutoutRight}></span>
              </div>


              {/* =========================================
                  ROUTE
              ========================================= */}

              <div style={styles.routeSection}>

                <div style={styles.location}>

                  <span style={styles.locationLabel}>
                    FROM
                  </span>

                  <h2 style={styles.locationName}>
                    {source}
                  </h2>

                  <span style={styles.time}>
                    {departure}
                  </span>

                </div>


                <div style={styles.routeMiddle}>

                  <div style={styles.routeLine}></div>

                  <div style={styles.busCircle}>
                    🚌
                  </div>

                  <div style={styles.routeLine}></div>

                </div>


                <div
                  style={{
                    ...styles.location,
                    ...styles.destination
                  }}
                >

                  <span style={styles.locationLabel}>
                    TO
                  </span>

                  <h2 style={styles.locationName}>
                    {destination}
                  </h2>

                  <span style={styles.time}>
                    {arrival}
                  </span>

                </div>

              </div>


              {/* =========================================
                  TRAVEL DATE
              ========================================= */}

              <div style={styles.travelDateBox}>

                <div style={styles.dateIcon}>
                  📅
                </div>

                <div>

                  <span style={styles.smallLabel}>
                    TRAVEL DATE
                  </span>

                  <strong style={styles.dateText}>
                    {formatDate(travelDate)}
                  </strong>

                </div>

              </div>


              {/* =========================================
                  BUS DETAILS
              ========================================= */}

              <div style={styles.detailsGrid}>

                <div style={styles.detailItem}>

                  <span style={styles.detailIcon}>
                    🚌
                  </span>

                  <div>

                    <span style={styles.detailLabel}>
                      BUS
                    </span>

                    <strong style={styles.detailValue}>
                      {busName}
                    </strong>

                  </div>

                </div>


                <div style={styles.detailItem}>

                  <span style={styles.detailIcon}>
                    🔢
                  </span>

                  <div>

                    <span style={styles.detailLabel}>
                      BUS NUMBER
                    </span>

                    <strong style={styles.detailValue}>
                      {busNumber}
                    </strong>

                  </div>

                </div>


                <div style={styles.detailItem}>

                  <span style={styles.detailIcon}>
                    🚍
                  </span>

                  <div>

                    <span style={styles.detailLabel}>
                      BUS TYPE
                    </span>

                    <strong style={styles.detailValue}>
                      {busType}
                    </strong>

                  </div>

                </div>


                <div style={styles.detailItem}>

                  <span style={styles.detailIcon}>
                    🆔
                  </span>

                  <div>

                    <span style={styles.detailLabel}>
                      SCHEDULE
                    </span>

                    <strong style={styles.detailValue}>
                      #{scheduleId}
                    </strong>

                  </div>

                </div>

              </div>


              {/* =========================================
                  SEATS
              ========================================= */}

              {Array.isArray(booking.seats) &&
                booking.seats.length > 0 && (

                  <div style={styles.seatsSection}>

                    <div style={styles.sectionHeader}>

                      <div>

                        <h3 style={styles.sectionTitle}>
                          💺 Selected Seats
                        </h3>

                        <span style={styles.sectionSubtitle}>
                          {booking.seats.length}{" "}
                          {booking.seats.length === 1
                            ? "seat"
                            : "seats"} selected
                        </span>

                      </div>

                    </div>


                    <div style={styles.seats}>

                      {booking.seats.map(
                        (seat, index) => (

                          <div
                            key={
                              seat.seat_id ||
                              index
                            }
                            style={styles.seat}
                          >

                            <span style={styles.seatNumber}>
                              {seat.seat_number}
                            </span>

                            <span style={styles.seatType}>
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
                  FOOTER
              ========================================= */}

              <div style={styles.ticketFooter}>

                <div style={styles.amountBox}>

                  <span style={styles.amountLabel}>
                    TOTAL AMOUNT
                  </span>

                  <strong style={styles.amount}>
                    ₹{totalAmount}
                  </strong>

                </div>


                {isConfirmed && (

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
                      ? "⏳ Cancelling..."
                      : "✕ Cancel Ticket"}

                  </button>

                )}


                {isCancelled && (

                  <div style={styles.cancelledMessage}>

                    <span>
                      ✕
                    </span>

                    Booking Cancelled

                  </div>

                )}

              </div>

            </div>

          );

        })}

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
    padding: "40px 20px 70px",
    background:
      "linear-gradient(135deg, #f5f7fb 0%, #eef3ff 100%)",
    fontFamily:
      "'Segoe UI', Arial, sans-serif",
    boxSizing: "border-box"
  },


  // ===================================================
  // HERO
  // ===================================================

  hero: {
    maxWidth: "1050px",
    margin: "0 auto 35px",
    padding: "28px 32px",
    borderRadius: "22px",
    background:
      "linear-gradient(135deg, #172554 0%, #2563eb 55%, #4f46e5 100%)",
    color: "white",
    display: "flex",
    alignItems: "center",
    gap: "18px",
    boxShadow:
      "0 15px 40px rgba(37,99,235,0.25)",
    position: "relative",
    overflow: "hidden"
  },


  heroIcon: {
    width: "62px",
    height: "62px",
    borderRadius: "18px",
    background:
      "rgba(255,255,255,0.16)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "30px",
    flexShrink: 0
  },


  title: {
    margin: 0,
    fontSize: "32px",
    fontWeight: "800",
    letterSpacing: "-0.5px"
  },


  subtitle: {
    margin: "6px 0 0",
    color: "rgba(255,255,255,0.8)",
    fontSize: "15px"
  },


  bookingCount: {
    marginLeft: "auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "80px",
    padding: "12px 18px",
    borderRadius: "15px",
    background:
      "rgba(255,255,255,0.13)"
  },


  countNumber: {
    fontSize: "25px",
    fontWeight: "800"
  },


  countLabel: {
    fontSize: "12px",
    opacity: 0.8
  },


  // ===================================================
  // BOOKING LIST
  // ===================================================

  bookingList: {
    maxWidth: "1050px",
    margin: "0 auto"
  },


  // ===================================================
  // CARD
  // ===================================================

  card: {
    background: "white",
    borderRadius: "22px",
    marginBottom: "28px",
    padding: "28px",
    boxShadow:
      "0 12px 35px rgba(15,23,42,0.08)",
    border:
      "1px solid rgba(226,232,240,0.9)",
    overflow: "hidden"
  },


  cancelledCard: {
    opacity: 0.88
  },


  // ===================================================
  // TICKET HEADER
  // ===================================================

  ticketTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px"
  },


  bookingInfo: {
    display: "flex",
    alignItems: "center",
    gap: "15px"
  },


  ticketIcon: {
    width: "54px",
    height: "54px",
    borderRadius: "15px",
    background: "#eff6ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "27px"
  },


  smallLabel: {
    display: "block",
    color: "#94a3b8",
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "1px",
    marginBottom: "3px"
  },


  bookingReference: {
    margin: 0,
    fontSize: "20px",
    color: "#0f172a",
    fontWeight: "800"
  },


  bookingId: {
    display: "block",
    marginTop: "4px",
    color: "#64748b",
    fontSize: "12px"
  },


  // ===================================================
  // STATUS
  // ===================================================

  status: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "9px 15px",
    borderRadius: "50px",
    background: "#f1f5f9",
    color: "#475569",
    fontSize: "12px",
    fontWeight: "800",
    letterSpacing: "0.4px"
  },


  confirmed: {
    background: "#dcfce7",
    color: "#15803d"
  },


  cancelled: {
    background: "#fee2e2",
    color: "#dc2626"
  },


  // ===================================================
  // SEPARATOR
  // ===================================================

  separator: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    margin: "25px -28px 25px",
    height: "12px"
  },


  dashedLine: {
    width: "100%",
    borderTop:
      "2px dashed #dbe2ea"
  },


  cutoutLeft: {
    position: "absolute",
    left: "-7px",
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    background: "#f1f5fb"
  },


  cutoutRight: {
    position: "absolute",
    right: "-7px",
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    background: "#f1f5fb"
  },


  // ===================================================
  // ROUTE
  // ===================================================

  routeSection: {
    display: "grid",
    gridTemplateColumns:
      "1fr 180px 1fr",
    alignItems: "center",
    gap: "15px",
    padding: "10px 0 25px"
  },


  location: {
    textAlign: "left"
  },


  destination: {
    textAlign: "right"
  },


  locationLabel: {
    display: "block",
    color: "#94a3b8",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "1.2px",
    marginBottom: "6px"
  },


  locationName: {
    margin: 0,
    fontSize: "25px",
    color: "#0f172a",
    fontWeight: "800"
  },


  time: {
    display: "block",
    marginTop: "5px",
    color: "#64748b",
    fontSize: "14px",
    fontWeight: "600"
  },


  routeMiddle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px"
  },


  routeLine: {
    height: "2px",
    flex: 1,
    background:
      "linear-gradient(90deg,#bfdbfe,#dbeafe)"
  },


  busCircle: {
    width: "45px",
    height: "45px",
    borderRadius: "50%",
    background:
      "linear-gradient(135deg,#2563eb,#4f46e5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    boxShadow:
      "0 6px 15px rgba(37,99,235,0.25)",
    flexShrink: 0
  },


  // ===================================================
  // DATE
  // ===================================================

  travelDateBox: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    padding: "15px 18px",
    borderRadius: "14px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    marginBottom: "20px"
  },


  dateIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    background: "#dbeafe",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px"
  },


  dateText: {
    display: "block",
    marginTop: "3px",
    color: "#0f172a",
    fontSize: "15px"
  },


  // ===================================================
  // DETAILS
  // ===================================================

  detailsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, 1fr)",
    gap: "12px",
    marginBottom: "22px"
  },


  detailItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "13px",
    borderRadius: "13px",
    background: "#f8fafc",
    border: "1px solid #edf1f5"
  },


  detailIcon: {
    width: "34px",
    height: "34px",
    borderRadius: "9px",
    background: "#eff6ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "15px",
    flexShrink: 0
  },


  detailLabel: {
    display: "block",
    fontSize: "9px",
    fontWeight: "800",
    color: "#94a3b8",
    letterSpacing: "0.8px"
  },


  detailValue: {
    display: "block",
    marginTop: "3px",
    fontSize: "13px",
    color: "#334155"
  },


  // ===================================================
  // SEATS
  // ===================================================

  seatsSection: {
    paddingTop: "20px",
    borderTop:
      "1px solid #eef2f7",
    marginBottom: "22px"
  },


  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "13px"
  },


  sectionTitle: {
    margin: 0,
    fontSize: "16px",
    color: "#1e293b"
  },


  sectionSubtitle: {
    display: "block",
    marginTop: "3px",
    color: "#94a3b8",
    fontSize: "12px"
  },


  seats: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px"
  },


  seat: {
    minWidth: "65px",
    padding: "10px 13px",
    borderRadius: "11px",
    background:
      "linear-gradient(135deg,#eff6ff,#eef2ff)",
    border:
      "1px solid #bfdbfe",
    textAlign: "center"
  },


  seatNumber: {
    display: "block",
    color: "#1d4ed8",
    fontSize: "14px",
    fontWeight: "800"
  },


  seatType: {
    display: "block",
    marginTop: "2px",
    color: "#64748b",
    fontSize: "9px",
    textTransform: "uppercase"
  },


  // ===================================================
  // FOOTER
  // ===================================================

  ticketFooter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    paddingTop: "20px",
    borderTop:
      "1px solid #eef2f7"
  },


  amountBox: {
    display: "flex",
    flexDirection: "column"
  },


  amountLabel: {
    color: "#94a3b8",
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "1px"
  },


  amount: {
    marginTop: "4px",
    color: "#0f172a",
    fontSize: "25px",
    fontWeight: "900"
  },


  cancelButton: {
    padding: "12px 20px",
    border: "1px solid #fecaca",
    borderRadius: "11px",
    background: "#fff1f2",
    color: "#dc2626",
    fontSize: "14px",
    fontWeight: "800",
    cursor: "pointer",
    transition: "all 0.2s ease"
  },


  disabledButton: {
    opacity: 0.55,
    cursor: "not-allowed"
  },


  cancelledMessage: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "11px 16px",
    borderRadius: "11px",
    background: "#fef2f2",
    color: "#dc2626",
    fontSize: "13px",
    fontWeight: "800"
  },


  // ===================================================
  // ERROR
  // ===================================================

  error: {
    maxWidth: "1050px",
    margin: "0 auto 25px",
    padding: "15px 18px",
    borderRadius: "13px",
    background: "#fff1f2",
    border: "1px solid #fecdd3",
    color: "#be123c",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontWeight: "600"
  },


  errorIcon: {
    fontSize: "20px"
  },


  // ===================================================
  // EMPTY
  // ===================================================

  empty: {
    maxWidth: "600px",
    margin: "70px auto",
    padding: "55px 35px",
    background: "white",
    borderRadius: "24px",
    textAlign: "center",
    boxShadow:
      "0 15px 40px rgba(15,23,42,0.08)"
  },


  emptyIcon: {
    width: "80px",
    height: "80px",
    margin: "0 auto 20px",
    borderRadius: "25px",
    background: "#eff6ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "38px"
  },


  emptyTitle: {
    margin: "0 0 10px",
    color: "#0f172a",
    fontSize: "25px"
  },


  emptyText: {
    maxWidth: "450px",
    margin: "0 auto 25px",
    color: "#64748b",
    lineHeight: "1.6"
  },


  searchButton: {
    padding: "13px 25px",
    border: "none",
    borderRadius: "12px",
    background:
      "linear-gradient(135deg,#2563eb,#4f46e5)",
    color: "white",
    fontSize: "15px",
    fontWeight: "800",
    cursor: "pointer",
    boxShadow:
      "0 8px 20px rgba(37,99,235,0.25)"
  },


  // ===================================================
  // LOADING
  // ===================================================

  loadingPage: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background:
      "linear-gradient(135deg,#f5f7fb,#eef3ff)",
    fontFamily:
      "'Segoe UI', Arial, sans-serif"
  },


  loader: {
    width: "45px",
    height: "45px",
    borderRadius: "50%",
    border:
      "4px solid #dbeafe",
    borderTop:
      "4px solid #2563eb",
    animation:
      "bookingSpin 1s linear infinite",
    marginBottom: "20px"
  },


  loadingTitle: {
    margin: 0,
    color: "#0f172a"
  },


  loadingText: {
    color: "#64748b",
    marginTop: "8px"
  }

};


// =====================================================
// RESPONSIVE CSS
// =====================================================

const responsiveStyle = document.createElement("style");

responsiveStyle.innerHTML = `
  @keyframes bookingSpin {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 800px) {

    .booking-route {
      grid-template-columns: 1fr !important;
    }

  }
`;

if (
  typeof document !== "undefined" &&
  !document.getElementById(
    "booking-history-responsive-style"
  )
) {

  responsiveStyle.id =
    "booking-history-responsive-style";

  document.head.appendChild(
    responsiveStyle
  );
}


export default BookingHistory;