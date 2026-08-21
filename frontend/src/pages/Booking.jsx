import {
  useLocation,
  useNavigate
} from "react-router-dom";

import {
  useState
} from "react";

import api from "../services/api";


function Booking() {

  const location =
    useLocation();

  const navigate =
    useNavigate();


  // =====================================================
  // GET DATA FROM SEATS PAGE
  // =====================================================

  const bus =
    location.state?.bus;

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

  const [passenger, setPassenger] =
    useState({

      name: "",
      phone: "",
      email: ""

    });


  const [loading, setLoading] =
    useState(false);


  const [error, setError] =
    useState("");


  // =====================================================
  // BUS NOT FOUND
  // =====================================================

  if (!bus) {

    return (

      <div style={styles.page}>

        <div style={styles.errorWrapper}>

          <div style={styles.errorCard}>

            <div style={styles.errorIcon}>
              🚌
            </div>

            <h2 style={styles.errorTitle}>
              Bus Not Found
            </h2>

            <p style={styles.errorText}>
              Please search for a bus and select your
              seats before continuing with the booking.
            </p>

            <button
              type="button"
              style={styles.primaryButton}
              onClick={() =>
                navigate("/search")
              }
            >
              ← Back to Search
            </button>

          </div>

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

        <div style={styles.errorWrapper}>

          <div style={styles.errorCard}>

            <div style={styles.errorIcon}>
              📅
            </div>

            <h2 style={styles.errorTitle}>
              Schedule Not Found
            </h2>

            <p style={styles.errorText}>
              This bus does not have a valid schedule ID.
            </p>

            <button
              type="button"
              style={styles.primaryButton}
              onClick={() =>
                navigate("/search")
              }
            >
              ← Back to Search
            </button>

          </div>

        </div>

      </div>

    );
  }


  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange =
    (e) => {

      const {
        name,
        value
      } = e.target;


      setPassenger(
        (previous) => ({

          ...previous,

          [name]: value

        })
      );

    };


  // =====================================================
  // PRICE
  // =====================================================

  const pricePerSeat =
    Number(
      bus.fare ||
      bus.price ||
      500
    );


  const totalPrice =
    selectedSeats.length *
    pricePerSeat;


  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formattedDate =
    bus.travel_date
      ? new Date(
          bus.travel_date
        ).toLocaleDateString(
          "en-IN",
          {
            day: "2-digit",
            month: "short",
            year: "numeric"
          }
        )
      : "-";


  // =====================================================
  // BUS INFORMATION
  // =====================================================

  const busName =
    bus.bus_name ||
    bus.name ||
    "Bus";


  const busNumber =
    bus.bus_number ||
    bus.busNumber ||
    "-";


  const busType =
    bus.bus_type ||
    bus.busType ||
    "-";


  const source =
    bus.source ||
    bus.from ||
    "-";


  const destination =
    bus.destination ||
    bus.to ||
    "-";


  const departure =
    bus.departure_time ||
    bus.departure ||
    "-";


  const arrival =
    bus.arrival_time ||
    bus.arrival ||
    "-";


  // =====================================================
  // HANDLE BOOKING
  // =====================================================

  const handleBooking =
    async (e) => {

      e.preventDefault();

      setError("");


      // -------------------------------------------------
      // VALIDATION
      // -------------------------------------------------

      if (!scheduleId) {

        setError(
          "Schedule ID is missing."
        );

        return;
      }


      if (
        selectedSeats.length === 0
      ) {

        setError(
          "Please select at least one seat."
        );

        return;
      }


      if (
        !passenger.name.trim()
      ) {

        setError(
          "Passenger name is required."
        );

        return;
      }


      if (
        !passenger.phone.trim()
      ) {

        setError(
          "Passenger phone is required."
        );

        return;
      }


      if (
        !passenger.email.trim()
      ) {

        setError(
          "Passenger email is required."
        );

        return;
      }


      // -------------------------------------------------
      // START LOADING
      // -------------------------------------------------

      setLoading(true);


      try {

        // ===============================================
        // BOOKING REQUEST
        // ===============================================

        const bookingData = {

          scheduleId:
            Number(scheduleId),

          seats:
            selectedSeats,

          passenger_name:
            passenger.name.trim(),

          passenger_phone:
            passenger.phone.trim(),

          passenger_email:
            passenger.email.trim(),

          total_amount:
            totalPrice

        };


        console.log(
          "BOOKING REQUEST:",
          bookingData
        );


        // ===============================================
        // API REQUEST
        // ===============================================

        const response =
          await api.post(
            "/bookings",
            bookingData
          );


        console.log(
          "BOOKING RESPONSE:",
          response.data
        );


        // ===============================================
        // SUCCESS PAGE
        // ===============================================

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
          TOP HEADER
      ================================================= */}

      <header style={styles.topHeader}>

        <div style={styles.headerContent}>

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
            ← Back to Seats
          </button>


          <div>

            <div style={styles.headerBadge}>
              SECURE BOOKING
            </div>

            <h1 style={styles.pageTitle}>
              Confirm Your Booking
            </h1>

            <p style={styles.pageSubtitle}>
              Review your journey and enter passenger details
            </p>

          </div>

        </div>

      </header>


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main style={styles.container}>

        <div style={styles.mainGrid}>


          {/* =============================================
              LEFT COLUMN
          ============================================= */}

          <div>


            {/* ===========================================
                JOURNEY CARD
            =========================================== */}

            <section style={styles.card}>

              <div style={styles.cardHeader}>

                <div>

                  <span style={styles.cardLabel}>
                    YOUR JOURNEY
                  </span>

                  <h2 style={styles.cardTitle}>
                    {busName}
                  </h2>

                </div>


                <div style={styles.busIcon}>
                  🚌
                </div>

              </div>


              {/* BUS DETAILS */}

              <div style={styles.busDetails}>

                <div style={styles.detailBox}>

                  <span style={styles.detailLabel}>
                    Bus Number
                  </span>

                  <strong style={styles.detailValue}>
                    {busNumber}
                  </strong>

                </div>


                <div style={styles.detailBox}>

                  <span style={styles.detailLabel}>
                    Bus Type
                  </span>

                  <strong style={styles.detailValue}>
                    {busType}
                  </strong>

                </div>


                <div style={styles.detailBox}>

                  <span style={styles.detailLabel}>
                    Travel Date
                  </span>

                  <strong style={styles.detailValue}>
                    {formattedDate}
                  </strong>

                </div>


                <div style={styles.detailBox}>

                  <span style={styles.detailLabel}>
                    Schedule ID
                  </span>

                  <strong style={styles.detailValue}>
                    #{scheduleId}
                  </strong>

                </div>

              </div>


              {/* ROUTE */}

              <div style={styles.routeContainer}>

                <div style={styles.location}>

                  <div style={styles.locationDot}>
                    ●
                  </div>

                  <div>

                    <span style={styles.routeLabel}>
                      FROM
                    </span>

                    <strong style={styles.locationName}>
                      {source}
                    </strong>

                    <span style={styles.time}>
                      {departure}
                    </span>

                  </div>

                </div>


                <div style={styles.routeLine}>

                  <span style={styles.routeArrow}>
                    →
                  </span>

                </div>


                <div style={styles.location}>

                  <div style={styles.locationDot}>
                    ●
                  </div>

                  <div>

                    <span style={styles.routeLabel}>
                      TO
                    </span>

                    <strong style={styles.locationName}>
                      {destination}
                    </strong>

                    <span style={styles.time}>
                      {arrival}
                    </span>

                  </div>

                </div>

              </div>

            </section>


            {/* ===========================================
                SELECTED SEATS
            =========================================== */}

            <section style={styles.card}>

              <div style={styles.cardHeader}>

                <div>

                  <span style={styles.cardLabel}>
                    SEAT SELECTION
                  </span>

                  <h2 style={styles.cardTitle}>
                    Selected Seats
                  </h2>

                </div>


                <div style={styles.seatCount}>

                  {selectedSeats.length}

                  <span>
                    seat
                    {selectedSeats.length !== 1
                      ? "s"
                      : ""}
                  </span>

                </div>

              </div>


              {selectedSeats.length === 0 ? (

                <div style={styles.emptySeats}>

                  <span>
                    No seats selected
                  </span>

                </div>

              ) : (

                <div style={styles.seatContainer}>

                  {selectedSeats.map(
                    (seat) => (

                      <div
                        key={seat}
                        style={styles.seatCard}
                      >

                        <div style={styles.seatNumber}>
                          {seat}
                        </div>

                        <span>
                          Seat
                        </span>

                      </div>

                    )
                  )}

                </div>

              )}

            </section>


            {/* ===========================================
                PASSENGER DETAILS
            =========================================== */}

            <form
              onSubmit={handleBooking}
              style={styles.card}
            >

              <div style={styles.cardHeader}>

                <div>

                  <span style={styles.cardLabel}>
                    PASSENGER INFORMATION
                  </span>

                  <h2 style={styles.cardTitle}>
                    Passenger Details
                  </h2>

                </div>


                <div style={styles.formIcon}>
                  👤
                </div>

              </div>


              {/* NAME */}

              <div style={styles.field}>

                <label style={styles.label}>
                  Full Name
                </label>

                <div style={styles.inputWrapper}>

                  <span style={styles.inputIcon}>
                    👤
                  </span>

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

              </div>


              {/* PHONE */}

              <div style={styles.field}>

                <label style={styles.label}>
                  Phone Number
                </label>

                <div style={styles.inputWrapper}>

                  <span style={styles.inputIcon}>
                    📱
                  </span>

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

              </div>


              {/* EMAIL */}

              <div style={styles.field}>

                <label style={styles.label}>
                  Email Address
                </label>

                <div style={styles.inputWrapper}>

                  <span style={styles.inputIcon}>
                    ✉️
                  </span>

                  <input
                    style={styles.input}
                    type="email"
                    name="email"
                    value={passenger.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    required
                  />

                </div>

              </div>


              {/* ERROR */}

              {error && (

                <div style={styles.error}>

                  <span style={styles.errorIcon}>
                    ⚠️
                  </span>

                  <span>
                    {error}
                  </span>

                </div>

              )}


              {/* SUBMIT */}

              <button
                type="submit"
                disabled={
                  loading ||
                  selectedSeats.length === 0
                }
                style={{

                  ...styles.confirmButton,

                  opacity:
                    loading ||
                    selectedSeats.length === 0
                      ? 0.6
                      : 1

                }}
              >

                {loading ? (

                  <>
                    <span>
                      ⏳
                    </span>

                    Processing Booking...
                  </>

                ) : (

                  <>
                    <span>
                      🔒
                    </span>

                    Confirm & Book
                  </>

                )}

              </button>


              <p style={styles.secureText}>
                🔒 Your booking information is securely processed.
              </p>

            </form>

          </div>


          {/* =============================================
              RIGHT COLUMN - SUMMARY
          ============================================= */}

          <aside>


            <div style={styles.summaryCard}>

              <div style={styles.summaryHeader}>

                <div>

                  <span style={styles.cardLabel}>
                    BOOKING SUMMARY
                  </span>

                  <h2 style={styles.summaryTitle}>
                    Your Trip
                  </h2>

                </div>

                <div style={styles.checkIcon}>
                  ✓
                </div>

              </div>


              {/* ROUTE SUMMARY */}

              <div style={styles.summaryRoute}>

                <div>

                  <span style={styles.summarySmall}>
                    FROM
                  </span>

                  <strong style={styles.summaryLocation}>
                    {source}
                  </strong>

                </div>


                <div style={styles.summaryArrow}>
                  ↓
                </div>


                <div>

                  <span style={styles.summarySmall}>
                    TO
                  </span>

                  <strong style={styles.summaryLocation}>
                    {destination}
                  </strong>

                </div>

              </div>


              {/* DATE */}

              <div style={styles.summaryItem}>

                <span style={styles.summaryItemIcon}>
                  📅
                </span>

                <div>

                  <span style={styles.summarySmall}>
                    TRAVEL DATE
                  </span>

                  <strong style={styles.summaryItemValue}>
                    {formattedDate}
                  </strong>

                </div>

              </div>


              {/* TIME */}

              <div style={styles.summaryItem}>

                <span style={styles.summaryItemIcon}>
                  🕐
                </span>

                <div>

                  <span style={styles.summarySmall}>
                    JOURNEY TIME
                  </span>

                  <strong style={styles.summaryItemValue}>
                    {departure} - {arrival}
                  </strong>

                </div>

              </div>


              {/* BUS */}

              <div style={styles.summaryItem}>

                <span style={styles.summaryItemIcon}>
                  🚌
                </span>

                <div>

                  <span style={styles.summarySmall}>
                    BUS
                  </span>

                  <strong style={styles.summaryItemValue}>
                    {busName}
                  </strong>

                </div>

              </div>


              {/* SEATS */}

              <div style={styles.summaryItem}>

                <span style={styles.summaryItemIcon}>
                  💺
                </span>

                <div>

                  <span style={styles.summarySmall}>
                    SELECTED SEATS
                  </span>

                  <strong style={styles.summaryItemValue}>
                    {selectedSeats.length
                      ? selectedSeats.join(", ")
                      : "None"}
                  </strong>

                </div>

              </div>


              {/* DIVIDER */}

              <div style={styles.divider} />


              {/* PRICE */}

              <div style={styles.priceRow}>

                <span>
                  Price per seat
                </span>

                <strong>
                  ₹{pricePerSeat}
                </strong>

              </div>


              <div style={styles.priceRow}>

                <span>
                  Number of seats
                </span>

                <strong>
                  × {selectedSeats.length}
                </strong>

              </div>


              <div style={styles.divider} />


              {/* TOTAL */}

              <div style={styles.totalRow}>

                <div>

                  <span style={styles.totalLabel}>
                    TOTAL AMOUNT
                  </span>

                  <span style={styles.totalSubtext}>
                    Inclusive of all charges
                  </span>

                </div>


                <strong style={styles.totalAmount}>
                  ₹{totalPrice}
                </strong>

              </div>


              {/* STATUS */}

              <div style={styles.secureBadge}>

                <span>
                  ✓
                </span>

                <div>

                  <strong>
                    Secure Booking
                  </strong>

                  <small>
                    Your seats are reserved safely
                  </small>

                </div>

              </div>

            </div>

          </aside>

        </div>

      </main>

    </div>

  );

}


// =====================================================
// STYLES
// =====================================================

const styles = {


  // ===================================================
  // PAGE
  // ===================================================

  page: {

    minHeight: "100vh",

    background:
      "linear-gradient(135deg, #eef4ff 0%, #f8f9ff 45%, #f5f7fb 100%)",

    color: "#172033",

    fontFamily:
      "Inter, Arial, Helvetica, sans-serif",

    paddingBottom: "60px"

  },


  // ===================================================
  // HEADER
  // ===================================================

  topHeader: {

    background:
      "linear-gradient(135deg, #155eef 0%, #4338ca 100%)",

    color: "#ffffff",

    padding:
      "30px 25px 35px",

    boxShadow:
      "0 8px 30px rgba(37, 76, 160, 0.20)"

  },


  headerContent: {

    maxWidth: "1150px",

    margin: "0 auto",

    display: "flex",

    alignItems: "flex-start",

    gap: "25px",

    flexWrap: "wrap"

  },


  backButton: {

    padding:
      "11px 18px",

    border:
      "1px solid rgba(255,255,255,0.35)",

    background:
      "rgba(255,255,255,0.12)",

    color: "#ffffff",

    borderRadius: "10px",

    cursor: "pointer",

    fontSize: "14px",

    fontWeight: "600",

    backdropFilter: "blur(10px)"

  },


  headerBadge: {

    display: "inline-block",

    padding:
      "5px 10px",

    background:
      "rgba(255,255,255,0.15)",

    borderRadius: "20px",

    fontSize: "11px",

    fontWeight: "700",

    letterSpacing: "1px",

    marginBottom: "8px"

  },


  pageTitle: {

    margin: "0",

    fontSize: "32px",

    fontWeight: "800",

    color: "#ffffff",

    letterSpacing: "-0.5px"

  },


  pageSubtitle: {

    margin:
      "7px 0 0",

    color:
      "rgba(255,255,255,0.82)",

    fontSize: "15px"

  },


  // ===================================================
  // CONTAINER
  // ===================================================

  container: {

    maxWidth: "1150px",

    margin: "0 auto",

    padding:
      "35px 25px"

  },


  mainGrid: {

    display: "grid",

    gridTemplateColumns:
      "minmax(0, 1.65fr) minmax(320px, 0.85fr)",

    gap: "25px",

    alignItems: "start"

  },


  // ===================================================
  // CARD
  // ===================================================

  card: {

    background: "#ffffff",

    border:
      "1px solid #e6eaf2",

    borderRadius: "18px",

    padding: "26px",

    marginBottom: "22px",

    boxShadow:
      "0 8px 30px rgba(15, 23, 42, 0.07)",

    boxSizing: "border-box"

  },


  cardHeader: {

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    marginBottom: "22px"

  },


  cardLabel: {

    display: "block",

    color: "#52709d",

    fontSize: "11px",

    fontWeight: "800",

    letterSpacing: "1.2px",

    marginBottom: "5px"

  },


  cardTitle: {

    margin: "0",

    color: "#172033",

    fontSize: "22px",

    fontWeight: "800"

  },


  busIcon: {

    width: "52px",

    height: "52px",

    borderRadius: "14px",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    background: "#edf4ff",

    fontSize: "26px"

  },


  formIcon: {

    width: "48px",

    height: "48px",

    borderRadius: "13px",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    background: "#f1efff",

    fontSize: "23px"

  },


  // ===================================================
  // BUS DETAILS
  // ===================================================

  busDetails: {

    display: "grid",

    gridTemplateColumns:
      "repeat(4, minmax(0, 1fr))",

    gap: "12px",

    marginBottom: "25px"

  },


  detailBox: {

    padding: "14px",

    background: "#f8fafc",

    border:
      "1px solid #edf0f5",

    borderRadius: "12px"

  },


  detailLabel: {

    display: "block",

    color: "#718096",

    fontSize: "11px",

    fontWeight: "700",

    textTransform: "uppercase",

    letterSpacing: "0.5px",

    marginBottom: "6px"

  },


  detailValue: {

    color: "#1e293b",

    fontSize: "14px",

    fontWeight: "700",

    wordBreak: "break-word"

  },


  // ===================================================
  // ROUTE
  // ===================================================

  routeContainer: {

    display: "grid",

    gridTemplateColumns:
      "1fr 100px 1fr",

    alignItems: "center",

    padding: "22px",

    background:
      "linear-gradient(135deg, #f7faff, #f5f3ff)",

    border:
      "1px solid #e8eaf5",

    borderRadius: "15px"

  },


  location: {

    display: "flex",

    alignItems: "flex-start",

    gap: "12px"

  },


  locationDot: {

    color: "#2563eb",

    fontSize: "15px",

    marginTop: "3px"

  },


  routeLabel: {

    display: "block",

    color: "#718096",

    fontSize: "10px",

    fontWeight: "800",

    letterSpacing: "1px",

    marginBottom: "4px"

  },


  locationName: {

    display: "block",

    color: "#172033",

    fontSize: "19px",

    fontWeight: "800"

  },


  time: {

    display: "block",

    color: "#2563eb",

    fontSize: "13px",

    fontWeight: "700",

    marginTop: "4px"

  },


  routeLine: {

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    position: "relative"

  },


  routeArrow: {

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    width: "46px",

    height: "46px",

    borderRadius: "50%",

    background:
      "linear-gradient(135deg, #2563eb, #4f46e5)",

    color: "#ffffff",

    fontSize: "23px",

    fontWeight: "bold",

    boxShadow:
      "0 7px 18px rgba(37, 99, 235, 0.25)"

  },


  // ===================================================
  // SEATS
  // ===================================================

  seatCount: {

    padding:
      "8px 13px",

    background: "#eaf2ff",

    color: "#2563eb",

    borderRadius: "20px",

    fontSize: "14px",

    fontWeight: "800"

  },


  seatCount: {

    padding:
      "8px 13px",

    background: "#eaf2ff",

    color: "#2563eb",

    borderRadius: "20px",

    fontSize: "13px",

    fontWeight: "800"

  },


  seatContainer: {

    display: "flex",

    flexWrap: "wrap",

    gap: "12px"

  },


  seatCard: {

    minWidth: "72px",

    padding: "13px 16px",

    background:
      "linear-gradient(135deg, #eff6ff, #eef2ff)",

    border:
      "1px solid #bfdbfe",

    borderRadius: "12px",

    textAlign: "center",

    color: "#2563eb",

    fontWeight: "700"

  },


  seatNumber: {

    fontSize: "19px",

    fontWeight: "800",

    marginBottom: "3px"

  },


  emptySeats: {

    padding: "25px",

    background: "#fff7ed",

    color: "#c2410c",

    borderRadius: "12px",

    textAlign: "center",

    fontWeight: "600"

  },


  // ===================================================
  // FORM
  // ===================================================

  field: {

    marginBottom: "19px"

  },


  label: {

    display: "block",

    color: "#273449",

    fontSize: "13px",

    fontWeight: "700",

    marginBottom: "8px"

  },


  inputWrapper: {

    display: "flex",

    alignItems: "center",

    border:
      "1px solid #d7deea",

    borderRadius: "11px",

    background: "#ffffff",

    transition: "all 0.2s ease",

    overflow: "hidden"

  },


  inputIcon: {

    paddingLeft: "14px",

    fontSize: "16px"

  },


  input: {

    width: "100%",

    padding:
      "14px 14px 14px 10px",

    border: "none",

    outline: "none",

    background: "transparent",

    color: "#172033",

    fontSize: "15px",

    boxSizing: "border-box"

  },


  // ===================================================
  // ERROR
  // ===================================================

  error: {

    display: "flex",

    alignItems: "center",

    gap: "10px",

    padding: "13px 15px",

    marginTop: "10px",

    background: "#fff1f2",

    border:
      "1px solid #fecdd3",

    color: "#be123c",

    borderRadius: "10px",

    fontSize: "14px",

    fontWeight: "600"

  },


  errorIcon: {

    fontSize: "35px",

    marginBottom: "10px"

  },


  errorWrapper: {

    minHeight: "100vh",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    padding: "30px"

  },


  errorCard: {

    width: "100%",

    maxWidth: "480px",

    padding: "45px 35px",

    background: "#ffffff",

    borderRadius: "20px",

    textAlign: "center",

    boxShadow:
      "0 15px 45px rgba(15, 23, 42, 0.12)",

    border:
      "1px solid #e5e7eb"

  },


  errorTitle: {

    color: "#172033",

    fontSize: "25px",

    margin: "0 0 10px"

  },


  errorText: {

    color: "#64748b",

    lineHeight: "1.6",

    marginBottom: "25px"

  },


  // ===================================================
  // BUTTONS
  // ===================================================

  primaryButton: {

    border: "none",

    padding: "13px 22px",

    background:
      "linear-gradient(135deg, #2563eb, #4f46e5)",

    color: "#ffffff",

    borderRadius: "10px",

    fontSize: "14px",

    fontWeight: "700",

    cursor: "pointer",

    boxShadow:
      "0 6px 15px rgba(37, 99, 235, 0.22)"

  },


  confirmButton: {

    width: "100%",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    gap: "10px",

    padding: "16px",

    border: "none",

    borderRadius: "12px",

    background:
      "linear-gradient(135deg, #2563eb, #4f46e5)",

    color: "#ffffff",

    fontSize: "16px",

    fontWeight: "800",

    cursor: "pointer",

    marginTop: "22px",

    boxShadow:
      "0 8px 20px rgba(37, 99, 235, 0.25)"

  },


  secureText: {

    textAlign: "center",

    color: "#718096",

    fontSize: "12px",

    margin:
      "12px 0 0"

  },


  // ===================================================
  // SUMMARY CARD
  // ===================================================

  summaryCard: {

    background: "#ffffff",

    border:
      "1px solid #e3e8f0",

    borderRadius: "18px",

    padding: "25px",

    boxShadow:
      "0 10px 35px rgba(15, 23, 42, 0.08)",

    position: "sticky",

    top: "20px"

  },


  summaryHeader: {

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    marginBottom: "22px"

  },


  summaryTitle: {

    margin: "0",

    color: "#172033",

    fontSize: "22px",

    fontWeight: "800"

  },


  checkIcon: {

    width: "42px",

    height: "42px",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    borderRadius: "50%",

    background: "#dcfce7",

    color: "#15803d",

    fontSize: "20px",

    fontWeight: "900"

  },


  summaryRoute: {

    padding: "18px",

    background:
      "linear-gradient(135deg, #f8fbff, #f5f3ff)",

    borderRadius: "13px",

    border:
      "1px solid #e8ebf3",

    marginBottom: "18px"

  },


  summarySmall: {

    display: "block",

    color: "#7a8799",

    fontSize: "10px",

    fontWeight: "800",

    letterSpacing: "0.8px",

    marginBottom: "3px"

  },


  summaryLocation: {

    display: "block",

    color: "#172033",

    fontSize: "16px",

    fontWeight: "800"

  },


  summaryArrow: {

    color: "#4f46e5",

    fontSize: "20px",

    margin:
      "7px 0"

  },


  summaryItem: {

    display: "flex",

    alignItems: "center",

    gap: "13px",

    padding:
      "13px 0",

    borderBottom:
      "1px solid #eef1f5"

  },


  summaryItemIcon: {

    width: "38px",

    height: "38px",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    background: "#f1f5f9",

    borderRadius: "10px",

    fontSize: "17px"

  },


  summaryItemValue: {

    display: "block",

    color: "#172033",

    fontSize: "14px",

    marginTop: "2px"

  },


  divider: {

    height: "1px",

    background: "#e8ecf2",

    margin:
      "18px 0"

  },


  priceRow: {

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    color: "#64748b",

    fontSize: "14px",

    marginBottom: "11px"

  },


  totalRow: {

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    gap: "15px"

  },


  totalLabel: {

    display: "block",

    color: "#64748b",

    fontSize: "11px",

    fontWeight: "800",

    letterSpacing: "0.8px"

  },


  totalSubtext: {

    display: "block",

    color: "#94a3b8",

    fontSize: "10px",

    marginTop: "3px"

  },


  totalAmount: {

    color: "#172033",

    fontSize: "25px",

    fontWeight: "900",

    whiteSpace: "nowrap"

  },


  secureBadge: {

    display: "flex",

    alignItems: "center",

    gap: "10px",

    marginTop: "22px",

    padding: "13px",

    background: "#f0fdf4",

    border:
      "1px solid #bbf7d0",

    borderRadius: "11px",

    color: "#166534"

  },


  secureBadge: {

    display: "flex",

    alignItems: "center",

    gap: "10px",

    marginTop: "22px",

    padding: "13px",

    background: "#f0fdf4",

    border:
      "1px solid #bbf7d0",

    borderRadius: "11px",

    color: "#166534"

  }

};


export default Booking;
