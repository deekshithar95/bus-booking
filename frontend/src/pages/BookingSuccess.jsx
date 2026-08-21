import { useLocation, useNavigate } from "react-router-dom";

function BookingSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  const booking = location.state?.booking;
  const bus = location.state?.bus;
  const selectedSeats = location.state?.selectedSeats || [];
  const passenger = location.state?.passenger;
  const scheduleId = location.state?.scheduleId;

  // =====================================================
  // BOOKING DATA
  // =====================================================

  const bookingReference =
    booking?.bookingReference ||
    booking?.booking_reference ||
    "-";

  const bookingStatus =
    booking?.status ||
    "CONFIRMED";

  const totalAmount =
    booking?.totalAmount ??
    booking?.total_amount ??
    0;

  const busName =
    bus?.bus_name ||
    bus?.name ||
    "Bus";

  const busNumber =
    bus?.bus_number ||
    bus?.busNumber ||
    "-";

  const busType =
    bus?.bus_type ||
    bus?.busType ||
    "-";

  const source =
    bus?.source ||
    bus?.from ||
    "-";

  const destination =
    bus?.destination ||
    bus?.to ||
    "-";

  const travelDate =
    bus?.travel_date ||
    bus?.travelDate ||
    "-";

  const departure =
    bus?.departure_time ||
    bus?.departureTime ||
    "-";

  const arrival =
    bus?.arrival_time ||
    bus?.arrivalTime ||
    "-";

  // =====================================================
  // BOOKING NOT FOUND
  // =====================================================

  if (!booking) {
    return (
      <div style={styles.page}>
        <div style={styles.notFoundCard}>

          <div style={styles.warningIcon}>
            !
          </div>

          <h1 style={styles.notFoundTitle}>
            Booking Information Not Found
          </h1>

          <p style={styles.notFoundText}>
            Your booking may have been completed, but the
            booking details are not available on this page.
          </p>

          <button
            type="button"
            style={styles.primaryButton}
            onClick={() => navigate("/")}
          >
            Go to Home
          </button>

        </div>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div style={styles.page}>

      {/* =================================================
          TOP SUCCESS HEADER
      ================================================= */}

      <div style={styles.hero}>

        <div style={styles.successCircle}>
          <span style={styles.check}>
            ✓
          </span>
        </div>

        <h1 style={styles.heroTitle}>
          Booking Confirmed!
        </h1>

        <p style={styles.heroSubtitle}>
          Your bus ticket has been booked successfully.
        </p>

      </div>


      {/* =================================================
          MAIN TICKET
      ================================================= */}

      <div style={styles.ticket}>

        {/* ===============================================
            TICKET TOP
        =============================================== */}

        <div style={styles.ticketHeader}>

          <div>

            <div style={styles.smallLabel}>
              BUS BOOKING
            </div>

            <h2 style={styles.busName}>
              {busName}
            </h2>

            <p style={styles.busNumber}>
              {busNumber}
            </p>

          </div>


          <div style={styles.statusBadge}>
            <span style={styles.statusDot}>
              ●
            </span>

            {bookingStatus}
          </div>

        </div>


        {/* ===============================================
            BOOKING REFERENCE
        =============================================== */}

        <div style={styles.referenceBox}>

          <div>

            <span style={styles.referenceLabel}>
              BOOKING REFERENCE
            </span>

            <div style={styles.referenceValue}>
              {bookingReference}
            </div>

          </div>

          <div style={styles.confirmedIcon}>
            ✓
          </div>

        </div>


        {/* ===============================================
            JOURNEY
        =============================================== */}

        <div style={styles.journeySection}>

          <div style={styles.locationBlock}>

            <span style={styles.locationLabel}>
              FROM
            </span>

            <h2 style={styles.location}>
              {source}
            </h2>

            {departure !== "-" && (
              <span style={styles.time}>
                {departure}
              </span>
            )}

          </div>


          <div style={styles.route}>

            <div style={styles.routeLine}></div>

            <div style={styles.busIcon}>
              🚌
            </div>

            <div style={styles.routeLine}></div>

          </div>


          <div style={styles.locationBlock}>

            <span style={styles.locationLabel}>
              TO
            </span>

            <h2 style={styles.location}>
              {destination}
            </h2>

            {arrival !== "-" && (
              <span style={styles.time}>
                {arrival}
              </span>
            )}

          </div>

        </div>


        {/* ===============================================
            TRAVEL DATE
        =============================================== */}

        <div style={styles.dateBox}>

          <div style={styles.dateIcon}>
            📅
          </div>

          <div>

            <span style={styles.dateLabel}>
              TRAVEL DATE
            </span>

            <strong style={styles.dateValue}>
              {formatDate(travelDate)}
            </strong>

          </div>

        </div>


        {/* ===============================================
            DIVIDER
        =============================================== */}

        <div style={styles.dashedDivider}></div>


        {/* ===============================================
            BOOKING DETAILS
        =============================================== */}

        <div style={styles.section}>

          <h3 style={styles.sectionTitle}>
            Booking Details
          </h3>


          <div style={styles.detailsGrid}>

            <DetailItem
              label="Schedule ID"
              value={
                scheduleId ||
                booking.scheduleId ||
                booking.schedule_id ||
                "-"
              }
            />

            <DetailItem
              label="Bus Number"
              value={busNumber}
            />

            <DetailItem
              label="Bus Type"
              value={busType}
            />

            <DetailItem
              label="Number of Seats"
              value={selectedSeats.length}
            />

          </div>

        </div>


        {/* ===============================================
            SEATS
        =============================================== */}

        <div style={styles.section}>

          <h3 style={styles.sectionTitle}>
            Selected Seats
          </h3>

          {selectedSeats.length > 0 ? (

            <div style={styles.seatsContainer}>

              {selectedSeats.map((seat) => (

                <div
                  key={seat}
                  style={styles.seatChip}
                >

                  <span style={styles.seatIcon}>
                    💺
                  </span>

                  <strong>
                    Seat {seat}
                  </strong>

                </div>

              ))}

            </div>

          ) : (

            <p style={styles.noData}>
              No seat information available.
            </p>

          )}

        </div>


        {/* ===============================================
            PASSENGER DETAILS
        =============================================== */}

        {passenger && (

          <div style={styles.section}>

            <h3 style={styles.sectionTitle}>
              Passenger Details
            </h3>


            <div style={styles.passengerCard}>

              <div style={styles.avatar}>
                {passenger.name
                  ? passenger.name
                      .charAt(0)
                      .toUpperCase()
                  : "P"}
              </div>


              <div style={styles.passengerInfo}>

                <strong style={styles.passengerName}>
                  {passenger.name || "-"}
                </strong>

                <span>
                  📞 {passenger.phone || "-"}
                </span>

                <span>
                  ✉️ {passenger.email || "-"}
                </span>

              </div>

            </div>

          </div>

        )}


        {/* ===============================================
            PAYMENT SUMMARY
        =============================================== */}

        <div style={styles.paymentBox}>

          <div style={styles.paymentRow}>

            <span>
              Ticket Price
            </span>

            <strong>
              ₹{totalAmount}
            </strong>

          </div>


          <div style={styles.paymentRow}>

            <span>
              Payment Status
            </span>

            <span style={styles.paidBadge}>
              PAID
            </span>

          </div>


          <div style={styles.paymentDivider}></div>


          <div style={styles.totalRow}>

            <span>
              Total Amount
            </span>

            <strong>
              ₹{totalAmount}
            </strong>

          </div>

        </div>


        {/* ===============================================
            IMPORTANT MESSAGE
        =============================================== */}

        <div style={styles.infoMessage}>

          <span style={styles.infoIcon}>
            ℹ
          </span>

          <span>
            Please keep your booking reference handy
            during your journey.
          </span>

        </div>


        {/* ===============================================
            ACTION BUTTONS
        =============================================== */}

        <div style={styles.actions}>

          <button
            type="button"
            style={styles.primaryButton}
            onClick={() => navigate("/")}
          >
            ← Back to Home
          </button>


          <button
            type="button"
            style={styles.secondaryButton}
            onClick={() => navigate("/search")}
          >
            🚌 Book Another Ticket
          </button>

        </div>


        {/* ===============================================
            FOOTER
        =============================================== */}

        <div style={styles.ticketFooter}>

          <span>
            Thank you for booking with us!
          </span>

          <span>
            Have a safe journey 🚌
          </span>

        </div>

      </div>

    </div>
  );
}


// =====================================================
// DETAIL COMPONENT
// =====================================================

function DetailItem({ label, value }) {
  return (
    <div style={styles.detailItem}>

      <span style={styles.detailLabel}>
        {label}
      </span>

      <strong style={styles.detailValue}>
        {value}
      </strong>

    </div>
  );
}


// =====================================================
// DATE FORMATTER
// =====================================================

function formatDate(date) {

  if (!date || date === "-") {
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
      "linear-gradient(135deg, #eef4ff 0%, #f8faff 45%, #eef2ff 100%)",
    padding: "45px 20px 70px",
    boxSizing: "border-box",
    fontFamily:
      "'Inter', 'Segoe UI', Arial, sans-serif"
  },


  // ===================================================
  // HERO
  // ===================================================

  hero: {
    maxWidth: "800px",
    margin: "0 auto 30px",
    textAlign: "center"
  },


  successCircle: {
    width: "90px",
    height: "90px",
    margin: "0 auto 20px",
    borderRadius: "50%",
    background:
      "linear-gradient(135deg, #16a34a, #22c55e)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow:
      "0 12px 30px rgba(34,197,94,0.30)"
  },


  check: {
    color: "#fff",
    fontSize: "50px",
    fontWeight: "800",
    lineHeight: 1
  },


  heroTitle: {
    margin: "0",
    color: "#172554",
    fontSize: "38px",
    fontWeight: "800",
    letterSpacing: "-1px"
  },


  heroSubtitle: {
    margin: "10px 0 0",
    color: "#64748b",
    fontSize: "17px"
  },


  // ===================================================
  // TICKET
  // ===================================================

  ticket: {
    maxWidth: "800px",
    margin: "0 auto",
    background: "#fff",
    borderRadius: "22px",
    overflow: "hidden",
    boxShadow:
      "0 20px 55px rgba(15,23,42,0.13)",
    border: "1px solid #e2e8f0"
  },


  // ===================================================
  // TICKET HEADER
  // ===================================================

  ticketHeader: {
    padding: "28px 32px",
    background:
      "linear-gradient(135deg, #1e3a8a, #2563eb, #4f46e5)",
    color: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px"
  },


  smallLabel: {
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "2px",
    opacity: 0.8,
    marginBottom: "7px"
  },


  busName: {
    margin: 0,
    fontSize: "25px",
    fontWeight: "800"
  },


  busNumber: {
    margin: "6px 0 0",
    fontSize: "14px",
    opacity: 0.85
  },


  statusBadge: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    padding: "9px 14px",
    borderRadius: "30px",
    background: "rgba(255,255,255,0.16)",
    border: "1px solid rgba(255,255,255,0.30)",
    fontSize: "12px",
    fontWeight: "800",
    whiteSpace: "nowrap"
  },


  statusDot: {
    color: "#86efac",
    fontSize: "12px"
  },


  // ===================================================
  // REFERENCE
  // ===================================================

  referenceBox: {
    margin: "25px 32px",
    padding: "20px",
    borderRadius: "14px",
    background:
      "linear-gradient(135deg, #eff6ff, #eef2ff)",
    border: "1px solid #dbeafe",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  },


  referenceLabel: {
    display: "block",
    color: "#64748b",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "1.5px",
    marginBottom: "7px"
  },


  referenceValue: {
    color: "#1d4ed8",
    fontSize: "24px",
    fontWeight: "900",
    letterSpacing: "1px"
  },


  confirmedIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    background: "#dcfce7",
    color: "#15803d",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
    fontWeight: "900"
  },


  // ===================================================
  // JOURNEY
  // ===================================================

  journeySection: {
    padding: "15px 32px 28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px"
  },


  locationBlock: {
    flex: 1,
    textAlign: "center"
  },


  locationLabel: {
    display: "block",
    color: "#94a3b8",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "1.5px",
    marginBottom: "7px"
  },


  location: {
    margin: 0,
    color: "#0f172a",
    fontSize: "25px",
    fontWeight: "800"
  },


  time: {
    display: "block",
    marginTop: "7px",
    color: "#2563eb",
    fontSize: "14px",
    fontWeight: "700"
  },


  route: {
    width: "150px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },


  routeLine: {
    flex: 1,
    height: "2px",
    background:
      "linear-gradient(90deg, #bfdbfe, #60a5fa)"
  },


  busIcon: {
    width: "42px",
    height: "42px",
    margin: "0 8px",
    borderRadius: "50%",
    background: "#eff6ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    border: "1px solid #bfdbfe"
  },


  // ===================================================
  // DATE
  // ===================================================

  dateBox: {
    margin: "0 32px 25px",
    padding: "16px 18px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    background: "#f8fafc",
    borderRadius: "12px",
    border: "1px solid #e2e8f0"
  },


  dateIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "10px",
    background: "#dbeafe",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px"
  },


  dateLabel: {
    display: "block",
    color: "#94a3b8",
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "1.5px",
    marginBottom: "4px"
  },


  dateValue: {
    color: "#1e293b",
    fontSize: "16px"
  },


  // ===================================================
  // DIVIDER
  // ===================================================

  dashedDivider: {
    margin: "0 32px",
    borderTop:
      "2px dashed #cbd5e1"
  },


  // ===================================================
  // SECTIONS
  // ===================================================

  section: {
    margin: "25px 32px 0",
    padding: "22px",
    background: "#f8fafc",
    borderRadius: "14px",
    border: "1px solid #e2e8f0"
  },


  sectionTitle: {
    margin: "0 0 18px",
    color: "#1e293b",
    fontSize: "17px",
    fontWeight: "800"
  },


  detailsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "15px"
  },


  detailItem: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    padding: "12px",
    background: "#fff",
    borderRadius: "9px",
    border: "1px solid #e2e8f0"
  },


  detailLabel: {
    color: "#94a3b8",
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.7px"
  },


  detailValue: {
    color: "#334155",
    fontSize: "14px"
  },


  // ===================================================
  // SEATS
  // ===================================================

  seatsContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px"
  },


  seatChip: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 14px",
    borderRadius: "9px",
    background: "#eff6ff",
    color: "#1d4ed8",
    border: "1px solid #bfdbfe",
    fontSize: "14px"
  },


  seatIcon: {
    fontSize: "16px"
  },


  noData: {
    margin: 0,
    color: "#94a3b8"
  },


  // ===================================================
  // PASSENGER
  // ===================================================

  passengerCard: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    padding: "15px",
    background: "#fff",
    borderRadius: "12px",
    border: "1px solid #e2e8f0"
  },


  avatar: {
    width: "52px",
    height: "52px",
    borderRadius: "50%",
    background:
      "linear-gradient(135deg, #2563eb, #4f46e5)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "21px",
    fontWeight: "800",
    flexShrink: 0
  },


  passengerInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    color: "#64748b",
    fontSize: "13px"
  },


  passengerName: {
    color: "#1e293b",
    fontSize: "16px"
  },


  // ===================================================
  // PAYMENT
  // ===================================================

  paymentBox: {
    margin: "25px 32px 0",
    padding: "22px",
    borderRadius: "14px",
    background:
      "linear-gradient(135deg, #172554, #1e3a8a)",
    color: "#fff"
  },


  paymentRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px 0",
    color: "#dbeafe",
    fontSize: "14px"
  },


  paidBadge: {
    padding: "5px 10px",
    borderRadius: "20px",
    background: "#22c55e",
    color: "#052e16",
    fontSize: "10px",
    fontWeight: "900"
  },


  paymentDivider: {
    margin: "12px 0",
    borderTop:
      "1px solid rgba(255,255,255,0.18)"
  },


  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "21px",
    fontWeight: "800"
  },


  // ===================================================
  // INFO
  // ===================================================

  infoMessage: {
    margin: "20px 32px 0",
    padding: "13px 15px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "#fffbeb",
    border: "1px solid #fde68a",
    borderRadius: "10px",
    color: "#92400e",
    fontSize: "13px",
    lineHeight: "1.5"
  },


  infoIcon: {
    width: "23px",
    height: "23px",
    borderRadius: "50%",
    background: "#f59e0b",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    flexShrink: 0
  },


  // ===================================================
  // BUTTONS
  // ===================================================

  actions: {
    padding: "25px 32px 30px",
    display: "grid",
    gridTemplateColumns:
      "1fr 1fr",
    gap: "12px"
  },


  primaryButton: {
    width: "100%",
    padding: "14px 18px",
    border: "none",
    borderRadius: "10px",
    background:
      "linear-gradient(135deg, #2563eb, #4f46e5)",
    color: "#fff",
    fontSize: "15px",
    fontWeight: "800",
    cursor: "pointer",
    boxShadow:
      "0 8px 18px rgba(37,99,235,0.22)"
  },


  secondaryButton: {
    width: "100%",
    padding: "14px 18px",
    border: "1px solid #2563eb",
    borderRadius: "10px",
    background: "#fff",
    color: "#2563eb",
    fontSize: "15px",
    fontWeight: "800",
    cursor: "pointer"
  },


  // ===================================================
  // FOOTER
  // ===================================================

  ticketFooter: {
    padding: "18px 32px",
    background: "#f8fafc",
    borderTop: "1px solid #e2e8f0",
    display: "flex",
    justifyContent: "space-between",
    gap: "15px",
    color: "#64748b",
    fontSize: "12px"
  },


  // ===================================================
  // NOT FOUND
  // ===================================================

  notFoundCard: {
    maxWidth: "520px",
    margin: "100px auto",
    padding: "45px 35px",
    background: "#fff",
    borderRadius: "20px",
    textAlign: "center",
    boxShadow:
      "0 20px 50px rgba(15,23,42,0.12)",
    border: "1px solid #e2e8f0"
  },


  warningIcon: {
    width: "70px",
    height: "70px",
    margin: "0 auto 20px",
    borderRadius: "50%",
    background: "#fef3c7",
    color: "#d97706",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "38px",
    fontWeight: "900"
  },


  notFoundTitle: {
    margin: "0 0 12px",
    color: "#1e293b",
    fontSize: "25px"
  },


  notFoundText: {
    color: "#64748b",
    lineHeight: "1.6",
    marginBottom: "25px"
  }

};

export default BookingSuccess;