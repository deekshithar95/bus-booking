import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

function Seats() {
  const location = useLocation();
  const navigate = useNavigate();

  const bus = location.state?.bus;

  // =====================================================
  // GET SCHEDULE ID
  // =====================================================

  const scheduleId =
    location.state?.scheduleId ??
    bus?.schedule_id ??
    bus?.scheduleId;

  const [selectedSeats, setSelectedSeats] = useState([]);

  // =====================================================
  // NO BUS
  // =====================================================

  if (!bus) {
    return (
      <div style={styles.page}>
        <div style={styles.errorBox}>

          <div style={styles.errorIcon}>
            🚌
          </div>

          <h2 style={styles.errorTitle}>
            No Bus Selected
          </h2>

          <p style={styles.errorText}>
            Please search for a bus first and select a bus
            before choosing your seats.
          </p>

          <button
            type="button"
            style={styles.primaryButton}
            onClick={() => navigate("/search")}
          >
            ← Search Buses
          </button>

        </div>
      </div>
    );
  }

  // =====================================================
  // NO SCHEDULE
  // =====================================================

  if (
    scheduleId === undefined ||
    scheduleId === null ||
    Number.isNaN(Number(scheduleId))
  ) {
    return (
      <div style={styles.page}>
        <div style={styles.errorBox}>

          <div style={styles.errorIcon}>
            ⚠️
          </div>

          <h2 style={styles.errorTitle}>
            Schedule Not Found
          </h2>

          <p style={styles.errorText}>
            This bus does not contain a valid schedule ID.
            Please return to search and select another bus.
          </p>

          <button
            type="button"
            style={styles.primaryButton}
            onClick={() => navigate("/search")}
          >
            ← Back to Search
          </button>

        </div>
      </div>
    );
  }

  // =====================================================
  // BUS DETAILS
  // =====================================================

  const totalSeats = Number(
    bus.total_seats ??
    bus.totalSeats ??
    40
  );

  const seats = Array.from(
    { length: totalSeats },
    (_, index) => index + 1
  );

  const pricePerSeat = Number(
    bus.fare ??
    bus.price ??
    500
  );

  const totalAmount =
    selectedSeats.length * pricePerSeat;

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
    "Standard";

  const source =
    location.state?.from ||
    bus.source ||
    bus.from ||
    "-";

  const destination =
    location.state?.to ||
    bus.destination ||
    bus.to ||
    "-";

  const travelDate =
    location.state?.travelDate ||
    bus.travel_date ||
    bus.travelDate ||
    "-";

  // =====================================================
  // TOGGLE SEAT
  // =====================================================

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

  // =====================================================
  // CONTINUE BOOKING
  // =====================================================

  const continueBooking = () => {

    if (selectedSeats.length === 0) {
      alert("Please select at least one seat.");
      return;
    }

    const numericScheduleId =
      Number(scheduleId);

    const numericSeats =
      selectedSeats.map(
        (seat) => Number(seat)
      );

    const bookingState = {

      bus,

      scheduleId:
        numericScheduleId,

      selectedSeats:
        numericSeats,

      travelDate,

      from:
        source,

      to:
        destination

    };

    console.log(
      "CONTINUE BOOKING:",
      bookingState
    );

    navigate(
      "/booking",
      {
        state: bookingState
      }
    );
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

        <div style={styles.headerInner}>

          <button
            type="button"
            style={styles.backButton}
            onClick={() => navigate("/search")}
          >
            ← Back to Search
          </button>

          <div style={styles.headerCenter}>

            <div style={styles.headerIcon}>
              💺
            </div>

            <div>
              <h1 style={styles.headerTitle}>
                Select Your Seat
              </h1>

              <p style={styles.headerSubtitle}>
                Choose your preferred seat for the journey
              </p>
            </div>

          </div>

          <div style={styles.headerBadge}>
            {selectedSeats.length} Selected
          </div>

        </div>

      </header>


      {/* =================================================
          BUS INFORMATION
      ================================================= */}

      <div style={styles.container}>

        <div style={styles.busCard}>

          {/* BUS TITLE */}

          <div style={styles.busMain}>

            <div style={styles.busLogo}>
              🚌
            </div>

            <div>

              <h2 style={styles.busName}>
                {busName}
              </h2>

              <div style={styles.busMeta}>

                <span>
                  {busNumber}
                </span>

                <span style={styles.dot}>
                  •
                </span>

                <span>
                  {busType}
                </span>

              </div>

            </div>

          </div>


          {/* ROUTE */}

          <div style={styles.routeContainer}>

            <div style={styles.locationBox}>

              <span style={styles.locationLabel}>
                FROM
              </span>

              <strong style={styles.locationName}>
                {source}
              </strong>

            </div>


            <div style={styles.routeLine}>

              <span style={styles.routeCircle}>
                ●
              </span>

              <div style={styles.routeDash} />

              <span style={styles.routeBus}>
                🚌
              </span>

              <div style={styles.routeDash} />

              <span style={styles.routeCircle}>
                ●
              </span>

            </div>


            <div style={styles.locationBox}>

              <span style={styles.locationLabel}>
                TO
              </span>

              <strong style={styles.locationName}>
                {destination}
              </strong>

            </div>

          </div>


          {/* DATE / SCHEDULE / FARE */}

          <div style={styles.busStats}>

            <div style={styles.statItem}>

              <span style={styles.statIcon}>
                📅
              </span>

              <div>

                <span style={styles.statLabel}>
                  Travel Date
                </span>

                <strong style={styles.statValue}>
                  {travelDate !== "-"
                    ? new Date(
                        travelDate
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric"
                        }
                      )
                    : "-"}
                </strong>

              </div>

            </div>


            <div style={styles.statDivider} />


            <div style={styles.statItem}>

              <span style={styles.statIcon}>
                🆔
              </span>

              <div>

                <span style={styles.statLabel}>
                  Schedule
                </span>

                <strong style={styles.statValue}>
                  #{Number(scheduleId)}
                </strong>

              </div>

            </div>


            <div style={styles.statDivider} />


            <div style={styles.statItem}>

              <span style={styles.statIcon}>
                ₹
              </span>

              <div>

                <span style={styles.statLabel}>
                  Price / Seat
                </span>

                <strong style={styles.statValue}>
                  ₹{pricePerSeat}
                </strong>

              </div>

            </div>

          </div>

        </div>


        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <div style={styles.content}>

          {/* =================================================
              SEAT AREA
          ================================================= */}

          <section style={styles.seatSection}>

            <div style={styles.sectionHeader}>

              <div>

                <h2 style={styles.sectionTitle}>
                  Choose Your Seats
                </h2>

                <p style={styles.sectionSubtitle}>
                  Tap a seat to select or deselect it
                </p>

              </div>


              <div style={styles.availableBadge}>
                {totalSeats} Seats
              </div>

            </div>


            {/* BUS */}

            <div style={styles.busOuter}>

              {/* BUS FRONT */}

              <div style={styles.busFront}>

                <div style={styles.driverArea}>

                  <span style={styles.steering}>
                    ⦿
                  </span>

                  <span>
                    Driver
                  </span>

                </div>

              </div>


              {/* FRONT LABEL */}

              <div style={styles.frontLabel}>
                FRONT
              </div>


              {/* SEAT GRID */}

              <div style={styles.seatGrid}>

                {seats.map(
                  (seatNumber) => {

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
                        aria-label={`Seat ${seatNumber}`}
                        style={{
                          ...styles.seat,

                          ...(isSelected
                            ? styles.selectedSeat
                            : {})
                        }}
                      >

                        <span
                          style={
                            styles.seatIcon
                          }
                        >
                          ▣
                        </span>

                        <span>
                          {seatNumber}
                        </span>

                      </button>

                    );

                  }
                )}

              </div>


              {/* BUS BACK */}

              <div style={styles.busBack}>
                BACK
              </div>

            </div>


            {/* =================================================
                LEGEND
            ================================================= */}

            <div style={styles.legend}>

              <div style={styles.legendItem}>

                <span
                  style={{
                    ...styles.legendSeat,
                    background: "#ffffff",
                    border:
                      "2px solid #cbd5e1"
                  }}
                />

                <span>
                  Available
                </span>

              </div>


              <div style={styles.legendItem}>

                <span
                  style={{
                    ...styles.legendSeat,
                    background:
                      "linear-gradient(135deg, #1976d2, #1565c0)",
                    border:
                      "2px solid #1976d2"
                  }}
                />

                <span>
                  Selected
                </span>

              </div>


              <div style={styles.legendItem}>

                <span
                  style={{
                    ...styles.legendSeat,
                    background: "#e2e8f0",
                    border:
                      "2px solid #cbd5e1"
                  }}
                />

                <span>
                  Booked
                </span>

              </div>

            </div>

          </section>


          {/* =================================================
              BOOKING SUMMARY
          ================================================= */}

          <aside style={styles.summary}>

            <div style={styles.summaryHeader}>

              <div style={styles.summaryIcon}>
                🧾
              </div>

              <div>

                <h2 style={styles.summaryTitle}>
                  Booking Summary
                </h2>

                <p style={styles.summarySubtitle}>
                  Your selected journey
                </p>

              </div>

            </div>


            {/* ROUTE SUMMARY */}

            <div style={styles.summaryRoute}>

              <div>

                <span style={styles.summaryLocationLabel}>
                  FROM
                </span>

                <strong>
                  {source}
                </strong>

              </div>

              <span style={styles.summaryArrow}>
                →
              </span>

              <div style={{ textAlign: "right" }}>

                <span style={styles.summaryLocationLabel}>
                  TO
                </span>

                <strong>
                  {destination}
                </strong>

              </div>

            </div>


            {/* DETAILS */}

            <div style={styles.summaryDetails}>

              <div style={styles.summaryRow}>

                <span>
                  Bus
                </span>

                <strong>
                  {busName}
                </strong>

              </div>


              <div style={styles.summaryRow}>

                <span>
                  Bus Number
                </span>

                <strong>
                  {busNumber}
                </strong>

              </div>


              <div style={styles.summaryRow}>

                <span>
                  Schedule
                </span>

                <strong>
                  #{Number(scheduleId)}
                </strong>

              </div>


              <div style={styles.summaryRow}>

                <span>
                  Travel Date
                </span>

                <strong>
                  {travelDate !== "-"
                    ? new Date(
                        travelDate
                      ).toLocaleDateString(
                        "en-IN"
                      )
                    : "-"}
                </strong>

              </div>

            </div>


            {/* SELECTED SEATS */}

            <div style={styles.selectedSection}>

              <div style={styles.selectedHeader}>

                <span>
                  Selected Seats
                </span>

                <span style={styles.selectedCount}>
                  {selectedSeats.length}
                </span>

              </div>


              {selectedSeats.length === 0 ? (

                <div style={styles.noSeats}>
                  Select seats from the bus layout
                </div>

              ) : (

                <div style={styles.selectedSeats}>

                  {selectedSeats
                    .sort(
                      (a, b) => a - b
                    )
                    .map(
                      (seat) => (

                        <span
                          key={seat}
                          style={styles.selectedSeatTag}
                        >
                          Seat {seat}
                        </span>

                      )
                    )}

                </div>

              )}

            </div>


            {/* PRICE */}

            <div style={styles.priceBox}>

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
                  {selectedSeats.length}
                </strong>

              </div>


              <div style={styles.priceDivider} />


              <div style={styles.totalRow}>

                <span>
                  Total Amount
                </span>

                <strong>
                  ₹{totalAmount}
                </strong>

              </div>

            </div>


            {/* CONTINUE */}

            <button
              type="button"
              disabled={
                selectedSeats.length === 0
              }
              onClick={continueBooking}
              style={{
                ...styles.continueButton,

                ...(selectedSeats.length === 0
                  ? styles.disabledButton
                  : {})
              }}
            >

              <span>
                Continue to Booking
              </span>

              <span style={styles.buttonArrow}>
                →
              </span>

            </button>


            <p style={styles.secureText}>
              🔒 Your seat selection is secure
            </p>

          </aside>

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
    background:
      "linear-gradient(180deg, #eef5ff 0%, #f8fafc 35%, #f8fafc 100%)",
    fontFamily:
      "Arial, Helvetica, sans-serif",
    color: "#172033",
    paddingBottom: "50px",
    boxSizing: "border-box"
  },


  // ===================================================
  // HEADER
  // ===================================================

  topHeader: {
    background:
      "linear-gradient(135deg, #0d47a1 0%, #1976d2 55%, #42a5f5 100%)",
    color: "#fff",
    padding: "20px 25px",
    boxShadow:
      "0 5px 20px rgba(25,118,210,0.22)"
  },


  headerInner: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns:
      "1fr auto 1fr",
    alignItems: "center",
    gap: "20px"
  },


  backButton: {
    justifySelf: "start",
    padding: "11px 18px",
    border:
      "1px solid rgba(255,255,255,0.35)",
    borderRadius: "10px",
    background:
      "rgba(255,255,255,0.12)",
    color: "#fff",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
    backdropFilter: "blur(8px)"
  },


  headerCenter: {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },


  headerIcon: {
    width: "46px",
    height: "46px",
    borderRadius: "13px",
    background:
      "rgba(255,255,255,0.18)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "23px"
  },


  headerTitle: {
    margin: 0,
    fontSize: "24px",
    fontWeight: "800"
  },


  headerSubtitle: {
    margin: "4px 0 0",
    fontSize: "13px",
    color:
      "rgba(255,255,255,0.82)"
  },


  headerBadge: {
    justifySelf: "end",
    padding: "10px 15px",
    borderRadius: "20px",
    background:
      "rgba(255,255,255,0.15)",
    border:
      "1px solid rgba(255,255,255,0.25)",
    fontSize: "13px",
    fontWeight: "bold"
  },


  // ===================================================
  // CONTAINER
  // ===================================================

  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "30px 20px"
  },


  // ===================================================
  // BUS CARD
  // ===================================================

  busCard: {
    background: "#fff",
    borderRadius: "18px",
    padding: "25px",
    boxShadow:
      "0 8px 30px rgba(15,23,42,0.08)",
    border:
      "1px solid #e7edf5",
    marginBottom: "25px"
  },


  busMain: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "22px"
  },


  busLogo: {
    width: "58px",
    height: "58px",
    borderRadius: "16px",
    background:
      "linear-gradient(135deg, #e3f2fd, #bbdefb)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "29px"
  },


  busName: {
    margin: "0 0 6px",
    fontSize: "22px",
    color: "#16213e"
  },


  busMeta: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#64748b",
    fontSize: "14px"
  },


  dot: {
    color: "#94a3b8"
  },


  // ===================================================
  // ROUTE
  // ===================================================

  routeContainer: {
    display: "grid",
    gridTemplateColumns:
      "1fr minmax(180px, 320px) 1fr",
    alignItems: "center",
    gap: "20px",
    padding: "18px 20px",
    background: "#f8fafc",
    borderRadius: "14px",
    border:
      "1px solid #edf2f7"
  },


  locationBox: {
    display: "flex",
    flexDirection: "column",
    gap: "5px"
  },


  locationLabel: {
    fontSize: "10px",
    fontWeight: "800",
    color: "#64748b",
    letterSpacing: "1px"
  },


  locationName: {
    fontSize: "18px",
    color: "#172033"
  },


  routeLine: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "5px"
  },


  routeCircle: {
    color: "#1976d2",
    fontSize: "13px"
  },


  routeDash: {
    flex: 1,
    height: "2px",
    borderTop:
      "2px dashed #90caf9"
  },


  routeBus: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "#e3f2fd",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px"
  },


  // ===================================================
  // STATS
  // ===================================================

  busStats: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    marginTop: "20px",
    paddingTop: "20px",
    borderTop:
      "1px solid #edf2f7"
  },


  statItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },


  statIcon: {
    width: "38px",
    height: "38px",
    borderRadius: "10px",
    background: "#eff6ff",
    color: "#1976d2",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold"
  },


  statLabel: {
    display: "block",
    fontSize: "11px",
    color: "#64748b",
    marginBottom: "3px"
  },


  statValue: {
    display: "block",
    fontSize: "14px",
    color: "#172033"
  },


  statDivider: {
    width: "1px",
    height: "35px",
    background: "#e2e8f0"
  },


  // ===================================================
  // MAIN CONTENT
  // ===================================================

  content: {
    display: "grid",
    gridTemplateColumns:
      "minmax(0, 1.65fr) minmax(330px, 0.75fr)",
    gap: "25px",
    alignItems: "start"
  },


  // ===================================================
  // SEAT SECTION
  // ===================================================

  seatSection: {
    background: "#fff",
    borderRadius: "18px",
    padding: "28px",
    boxShadow:
      "0 8px 30px rgba(15,23,42,0.08)",
    border:
      "1px solid #e7edf5"
  },


  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "25px",
    gap: "15px"
  },


  sectionTitle: {
    margin: 0,
    fontSize: "21px",
    color: "#172033"
  },


  sectionSubtitle: {
    margin: "6px 0 0",
    color: "#64748b",
    fontSize: "13px"
  },


  availableBadge: {
    padding: "8px 13px",
    background: "#eff6ff",
    color: "#1976d2",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold"
  },


  // ===================================================
  // BUS
  // ===================================================

  busOuter: {
    maxWidth: "460px",
    margin: "0 auto",
    padding: "25px 25px 22px",
    borderRadius: "30px 30px 22px 22px",
    background:
      "linear-gradient(145deg, #f8fafc, #eef2f7)",
    border:
      "4px solid #334155",
    boxShadow:
      "0 15px 35px rgba(15,23,42,0.12)"
  },


  busFront: {
    height: "65px",
    borderBottom:
      "2px dashed #cbd5e1",
    marginBottom: "12px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },


  driverArea: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "9px 18px",
    background: "#e2e8f0",
    borderRadius: "10px",
    color: "#334155",
    fontWeight: "bold",
    fontSize: "13px"
  },


  steering: {
    fontSize: "20px"
  },


  frontLabel: {
    textAlign: "center",
    fontSize: "9px",
    fontWeight: "800",
    color: "#94a3b8",
    letterSpacing: "2px",
    marginBottom: "15px"
  },


  seatGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, 1fr)",
    gap: "13px",
    padding: "5px"
  },


  seat: {
    minHeight: "58px",
    border:
      "2px solid #bfdbfe",
    background: "#fff",
    color: "#1976d2",
    borderRadius: "11px",
    cursor: "pointer",
    fontWeight: "800",
    fontSize: "14px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "2px",
    transition:
      "all 0.2s ease",
    boxShadow:
      "0 3px 8px rgba(30,64,175,0.06)"
  },


  seatIcon: {
    fontSize: "15px",
    opacity: 0.8
  },


  selectedSeat: {
    background:
      "linear-gradient(135deg, #1976d2, #0d47a1)",
    color: "#fff",
    border:
      "2px solid #0d47a1",
    boxShadow:
      "0 7px 16px rgba(25,118,210,0.30)",
    transform: "translateY(-2px)"
  },


  busBack: {
    textAlign: "center",
    marginTop: "20px",
    paddingTop: "13px",
    borderTop:
      "2px dashed #cbd5e1",
    color: "#94a3b8",
    fontSize: "9px",
    fontWeight: "800",
    letterSpacing: "2px"
  },


  // ===================================================
  // LEGEND
  // ===================================================

  legend: {
    display: "flex",
    justifyContent: "center",
    gap: "25px",
    flexWrap: "wrap",
    marginTop: "25px",
    paddingTop: "20px",
    borderTop:
      "1px solid #edf2f7",
    color: "#64748b",
    fontSize: "13px"
  },


  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "7px"
  },


  legendSeat: {
    width: "18px",
    height: "18px",
    borderRadius: "5px",
    display: "inline-block",
    boxSizing: "border-box"
  },


  // ===================================================
  // SUMMARY
  // ===================================================

  summary: {
    background: "#fff",
    borderRadius: "18px",
    padding: "25px",
    boxShadow:
      "0 8px 30px rgba(15,23,42,0.10)",
    border:
      "1px solid #e7edf5",
    position: "sticky",
    top: "20px"
  },


  summaryHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    paddingBottom: "20px",
    borderBottom:
      "1px solid #edf2f7"
  },


  summaryIcon: {
    width: "44px",
    height: "44px",
    borderRadius: "12px",
    background:
      "linear-gradient(135deg, #e3f2fd, #bbdefb)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "21px"
  },


  summaryTitle: {
    margin: 0,
    fontSize: "19px"
  },


  summarySubtitle: {
    margin: "4px 0 0",
    color: "#64748b",
    fontSize: "12px"
  },


  // ===================================================
  // SUMMARY ROUTE
  // ===================================================

  summaryRoute: {
    display: "grid",
    gridTemplateColumns:
      "1fr auto 1fr",
    alignItems: "center",
    gap: "10px",
    margin: "20px 0",
    padding: "15px",
    background: "#f8fafc",
    borderRadius: "12px"
  },


  summaryLocationLabel: {
    display: "block",
    color: "#94a3b8",
    fontSize: "9px",
    fontWeight: "800",
    marginBottom: "4px",
    letterSpacing: "1px"
  },


  summaryArrow: {
    color: "#1976d2",
    fontSize: "20px",
    fontWeight: "bold"
  },


  // ===================================================
  // DETAILS
  // ===================================================

  summaryDetails: {
    paddingBottom: "18px",
    borderBottom:
      "1px solid #edf2f7"
  },


  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "15px",
    marginBottom: "13px",
    fontSize: "13px"
  },


  // ===================================================
  // SELECTED SEATS
  // ===================================================

  selectedSection: {
    padding: "18px 0",
    borderBottom:
      "1px solid #edf2f7"
  },


  selectedHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
    fontWeight: "bold",
    fontSize: "13px"
  },


  selectedCount: {
    minWidth: "26px",
    height: "26px",
    borderRadius: "50%",
    background: "#1976d2",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px"
  },


  noSeats: {
    padding: "14px",
    background: "#f8fafc",
    borderRadius: "9px",
    color: "#94a3b8",
    textAlign: "center",
    fontSize: "12px"
  },


  selectedSeats: {
    display: "flex",
    flexWrap: "wrap",
    gap: "7px"
  },


  selectedSeatTag: {
    padding: "7px 10px",
    borderRadius: "7px",
    background: "#e3f2fd",
    color: "#1565c0",
    fontWeight: "bold",
    fontSize: "12px"
  },


  // ===================================================
  // PRICE
  // ===================================================

  priceBox: {
    marginTop: "18px",
    padding: "16px",
    background:
      "linear-gradient(135deg, #f8fafc, #eff6ff)",
    borderRadius: "12px"
  },


  priceRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
    fontSize: "13px",
    color: "#64748b"
  },


  priceDivider: {
    height: "1px",
    background: "#dbeafe",
    margin: "14px 0"
  },


  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "15px",
    color: "#172033"
  },


  totalAmount: {
    fontSize: "23px",
    color: "#1976d2"
  },


  // ===================================================
  // BUTTON
  // ===================================================

  continueButton: {
    width: "100%",
    marginTop: "18px",
    padding: "15px 18px",
    border: "none",
    borderRadius: "11px",
    background:
      "linear-gradient(135deg, #1976d2, #0d47a1)",
    color: "#fff",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "800",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow:
      "0 8px 18px rgba(25,118,210,0.25)"
  },


  disabledButton: {
    background: "#cbd5e1",
    cursor: "not-allowed",
    boxShadow: "none"
  },


  buttonArrow: {
    fontSize: "20px"
  },


  secureText: {
    textAlign: "center",
    color: "#94a3b8",
    fontSize: "11px",
    margin: "12px 0 0"
  },


  // ===================================================
  // ERROR
  // ===================================================

  errorBox: {
    maxWidth: "480px",
    margin: "100px auto",
    padding: "45px 35px",
    background: "#fff",
    borderRadius: "20px",
    textAlign: "center",
    boxShadow:
      "0 15px 40px rgba(15,23,42,0.10)",
    border:
      "1px solid #e7edf5"
  },


  errorIcon: {
    width: "70px",
    height: "70px",
    margin: "0 auto 20px",
    borderRadius: "50%",
    background: "#eff6ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "30px"
  },


  errorTitle: {
    margin: "0 0 10px",
    fontSize: "23px",
    color: "#172033"
  },


  errorText: {
    color: "#64748b",
    lineHeight: "1.6",
    marginBottom: "25px"
  },


  primaryButton: {
    padding: "13px 24px",
    background:
      "linear-gradient(135deg, #1976d2, #0d47a1)",
    color: "#fff",
    border: "none",
    borderRadius: "9px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
    boxShadow:
      "0 6px 15px rgba(25,118,210,0.22)"
  }

};

export default Seats;