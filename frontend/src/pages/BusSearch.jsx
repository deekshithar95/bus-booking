import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function BusSearch() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    from: "",
    to: "",
    date: ""
  });

  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (e) => {
    setForm((previous) => ({
      ...previous,
      [e.target.name]: e.target.value
    }));
  };

  // =====================================================
  // SWAP SOURCE / DESTINATION
  // =====================================================

  const handleSwap = () => {
    setForm((previous) => ({
      ...previous,
      from: previous.to,
      to: previous.from
    }));
  };

  // =====================================================
  // SEARCH BUSES
  // =====================================================

  const searchBuses = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setBuses([]);

    try {
      const response = await api.get(
        "/buses/search",
        {
          params: {
            from: form.from.trim(),
            to: form.to.trim(),
            date: form.date
          }
        }
      );

      console.log(
        "SEARCH RESPONSE:",
        response.data
      );

      const result =
        response.data?.buses ||
        response.data ||
        [];

      if (Array.isArray(result) && result.length > 0) {
        setBuses(result);
      } else {
        setBuses([]);
        setError(
          "No buses found for this route and date."
        );
      }

    } catch (error) {

      console.error(
        "BUS SEARCH ERROR:",
        error.response?.data ||
        error.message
      );

      setError(
        error.response?.data?.message ||
        "Unable to search buses. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // SELECT BUS
  // =====================================================

  const selectBus = (bus) => {
    console.log(
      "SELECTED BUS:",
      bus
    );

    const scheduleId =
      bus.schedule_id ||
      bus.scheduleId;

    if (!scheduleId) {
      alert(
        "Schedule ID is missing from this bus."
      );
      return;
    }

    navigate(
      "/seats",
      {
        state: {
          bus,
          scheduleId,
          travelDate: form.date,
          from: form.from,
          to: form.to
        }
      }
    );
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {

    if (!date) {
      return "-";
    }

    const parsedDate =
      new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div style={styles.page}>

      {/* =================================================
          HERO HEADER
      ================================================= */}

      <section style={styles.hero}>

        <div style={styles.heroOverlay}>

          <div style={styles.heroContent}>

            <div style={styles.badge}>
              🚌 EASY BUS BOOKING
            </div>

            <h1 style={styles.heroTitle}>
              Find Your Perfect Bus Journey
            </h1>

            <p style={styles.heroSubtitle}>
              Search buses, compare schedules,
              choose your seats and travel with ease.
            </p>

          </div>

        </div>

      </section>


      {/* =================================================
          SEARCH SECTION
      ================================================= */}

      <main style={styles.container}>

        <section style={styles.searchCard}>

          <div style={styles.searchHeader}>

            <div>

              <h2 style={styles.searchTitle}>
                Search Buses
              </h2>

              <p style={styles.searchSubtitle}>
                Enter your journey details to find
                available buses.
              </p>

            </div>

            <div style={styles.searchIcon}>
              🔎
            </div>

          </div>


          <form
            onSubmit={searchBuses}
            style={styles.searchForm}
          >

            {/* =========================================
                FROM
            ========================================= */}

            <div style={styles.field}>

              <label style={styles.label}>
                FROM
              </label>

              <div style={styles.inputWrapper}>

                <span style={styles.inputIcon}>
                  📍
                </span>

                <input
                  style={styles.input}
                  name="from"
                  placeholder="Departure city"
                  value={form.from}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>


            {/* =========================================
                SWAP
            ========================================= */}

            <button
              type="button"
              onClick={handleSwap}
              style={styles.swapButton}
              title="Swap cities"
            >
              ⇄
            </button>


            {/* =========================================
                TO
            ========================================= */}

            <div style={styles.field}>

              <label style={styles.label}>
                TO
              </label>

              <div style={styles.inputWrapper}>

                <span style={styles.inputIcon}>
                  📍
                </span>

                <input
                  style={styles.input}
                  name="to"
                  placeholder="Destination city"
                  value={form.to}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>


            {/* =========================================
                DATE
            ========================================= */}

            <div style={styles.field}>

              <label style={styles.label}>
                TRAVEL DATE
              </label>

              <div style={styles.inputWrapper}>

                <span style={styles.inputIcon}>
                  📅
                </span>

                <input
                  style={styles.input}
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>


            {/* =========================================
                SEARCH BUTTON
            ========================================= */}

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.searchButton,
                ...(loading
                  ? styles.disabledButton
                  : {})
              }}
            >

              {loading ? (
                <>
                  <span style={styles.spinner}>
                    ⟳
                  </span>
                  Searching...
                </>
              ) : (
                <>
                  🔍 Search Buses
                </>
              )}

            </button>

          </form>

        </section>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (

          <div style={styles.errorBox}>

            <div style={styles.errorIcon}>
              !
            </div>

            <div>

              <strong>
                Search failed
              </strong>

              <p style={styles.errorText}>
                {error}
              </p>

            </div>

          </div>

        )}


        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (

          <div style={styles.loadingCard}>

            <div style={styles.loadingIcon}>
              🚌
            </div>

            <h3>
              Finding available buses...
            </h3>

            <p>
              Please wait while we search the
              available schedules.
            </p>

          </div>

        )}


        {/* =================================================
            SEARCH SUMMARY
        ================================================= */}

        {!loading &&
          buses.length > 0 && (

            <div style={styles.resultsHeader}>

              <div>

                <span style={styles.resultsLabel}>
                  AVAILABLE BUSES
                </span>

                <h2 style={styles.resultsTitle}>
                  {buses.length}{" "}
                  {buses.length === 1
                    ? "bus"
                    : "buses"}{" "}
                  found
                </h2>

              </div>


              <div style={styles.tripSummary}>

                <span>
                  📍 {form.from}
                </span>

                <span style={styles.arrow}>
                  →
                </span>

                <span>
                  📍 {form.to}
                </span>

                <span style={styles.dateBadge}>
                  📅 {formatDate(form.date)}
                </span>

              </div>

            </div>

          )}


        {/* =================================================
            EMPTY STATE
        ================================================= */}

        {!loading &&
          buses.length === 0 &&
          !error && (

            <div style={styles.emptyCard}>

              <div style={styles.emptyIcon}>
                🚌
              </div>

              <h2>
                Ready for your next journey?
              </h2>

              <p>
                Enter your departure city,
                destination and travel date above
                to find available buses.
              </p>

            </div>

          )}


        {/* =================================================
            BUS RESULTS
        ================================================= */}

        {!loading &&
          buses.length > 0 && (

            <div style={styles.resultsGrid}>

              {buses.map((bus, index) => {

                const scheduleId =
                  bus.schedule_id ||
                  bus.scheduleId;

                const busName =
                  bus.bus_name ||
                  bus.busName ||
                  bus.name ||
                  "Bus Service";

                const busNumber =
                  bus.bus_number ||
                  bus.busNumber ||
                  "-";

                const busType =
                  bus.bus_type ||
                  bus.busType ||
                  "Standard";

                const source =
                  bus.source ||
                  bus.from ||
                  form.from;

                const destination =
                  bus.destination ||
                  bus.to ||
                  form.to;

                const totalSeats =
                  bus.total_seats ||
                  bus.totalSeats ||
                  "-";

                const fare =
                  bus.fare ??
                  bus.price ??
                  0;

                const travelDate =
                  bus.travel_date ||
                  bus.travelDate ||
                  form.date;

                const departure =
                  bus.departure_time ||
                  bus.departureTime ||
                  "";

                const arrival =
                  bus.arrival_time ||
                  bus.arrivalTime ||
                  "";

                return (

                  <article
                    key={
                      scheduleId ||
                      `${busNumber}-${index}`
                    }
                    style={styles.busCard}
                  >

                    {/* ===================================
                        CARD TOP
                    =================================== */}

                    <div style={styles.busCardTop}>

                      <div style={styles.busBrand}>

                        <div style={styles.busIcon}>
                          🚌
                        </div>

                        <div>

                          <h3 style={styles.busName}>
                            {busName}
                          </h3>

                          <p style={styles.busNumber}>
                            {busNumber}
                          </p>

                        </div>

                      </div>


                      <span style={styles.busType}>
                        {busType}
                      </span>

                    </div>


                    {/* ===================================
                        ROUTE
                    =================================== */}

                    <div style={styles.routeSection}>

                      <div style={styles.location}>

                        <span style={styles.locationTime}>
                          {departure || "--:--"}
                        </span>

                        <strong>
                          {source}
                        </strong>

                        <small>
                          Departure
                        </small>

                      </div>


                      <div style={styles.routeLine}>

                        <span style={styles.routeDot}>
                          ●
                        </span>

                        <div style={styles.line}>
                        </div>

                        <span style={styles.routeBus}>
                          🚌
                        </span>

                      </div>


                      <div
                        style={{
                          ...styles.location,
                          textAlign: "right"
                        }}
                      >

                        <span style={styles.locationTime}>
                          {arrival || "--:--"}
                        </span>

                        <strong>
                          {destination}
                        </strong>

                        <small>
                          Arrival
                        </small>

                      </div>

                    </div>


                    {/* ===================================
                        DETAILS
                    =================================== */}

                    <div style={styles.detailsGrid}>

                      <div style={styles.detailItem}>

                        <span style={styles.detailIcon}>
                          📅
                        </span>

                        <div>

                          <small>
                            Travel Date
                          </small>

                          <strong>
                            {formatDate(travelDate)}
                          </strong>

                        </div>

                      </div>


                      <div style={styles.detailItem}>

                        <span style={styles.detailIcon}>
                          💺
                        </span>

                        <div>

                          <small>
                            Total Seats
                          </small>

                          <strong>
                            {totalSeats}
                          </strong>

                        </div>

                      </div>


                      <div style={styles.detailItem}>

                        <span style={styles.detailIcon}>
                          🆔
                        </span>

                        <div>

                          <small>
                            Schedule ID
                          </small>

                          <strong>
                            {scheduleId || "-"}
                          </strong>

                        </div>

                      </div>

                    </div>


                    {/* ===================================
                        CARD FOOTER
                    =================================== */}

                    <div style={styles.cardFooter}>

                      <div>

                        <span style={styles.priceLabel}>
                          Starting from
                        </span>

                        <div style={styles.price}>
                          ₹{fare}
                          <span style={styles.perSeat}>
                            / seat
                          </span>
                        </div>

                      </div>


                      <button
                        type="button"
                        onClick={() =>
                          selectBus(bus)
                        }
                        style={styles.selectButton}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform =
                            "translateY(-2px)";
                          e.currentTarget.style.boxShadow =
                            "0 8px 20px rgba(25,118,210,0.28)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform =
                            "translateY(0)";
                          e.currentTarget.style.boxShadow =
                            "none";
                        }}
                      >
                        Select Seats
                        <span style={styles.buttonArrow}>
                          →
                        </span>
                      </button>

                    </div>

                  </article>

                );
              })}

            </div>

          )}

      </main>

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
      "linear-gradient(180deg, #f4f8ff 0%, #f7f9fc 45%, #ffffff 100%)",
    fontFamily:
      "Inter, Arial, sans-serif",
    color: "#172033",
    paddingBottom: "60px"
  },


  // ===================================================
  // HERO
  // ===================================================

  hero: {
    minHeight: "300px",
    background:
      "linear-gradient(135deg, #0d47a1 0%, #1976d2 50%, #42a5f5 100%)",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    alignItems: "center"
  },


  heroOverlay: {
    width: "100%",
    background:
      "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.18), transparent 30%), radial-gradient(circle at 10% 90%, rgba(255,255,255,0.12), transparent 30%)"
  },


  heroContent: {
    maxWidth: "1150px",
    width: "100%",
    margin: "0 auto",
    padding: "55px 30px 90px",
    boxSizing: "border-box"
  },


  badge: {
    display: "inline-block",
    padding: "8px 14px",
    borderRadius: "30px",
    background:
      "rgba(255,255,255,0.16)",
    border:
      "1px solid rgba(255,255,255,0.25)",
    color: "#ffffff",
    fontSize: "12px",
    fontWeight: "800",
    letterSpacing: "1px",
    marginBottom: "18px"
  },


  heroTitle: {
    margin: 0,
    color: "#ffffff",
    fontSize: "clamp(32px, 5vw, 52px)",
    lineHeight: "1.12",
    fontWeight: "800",
    maxWidth: "750px"
  },


  heroSubtitle: {
    margin:
      "18px 0 0",
    color:
      "rgba(255,255,255,0.88)",
    fontSize: "17px",
    lineHeight: "1.6",
    maxWidth: "650px"
  },


  // ===================================================
  // CONTAINER
  // ===================================================

  container: {
    maxWidth: "1150px",
    margin: "-65px auto 0",
    padding: "0 25px",
    position: "relative",
    boxSizing: "border-box"
  },


  // ===================================================
  // SEARCH CARD
  // ===================================================

  searchCard: {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "28px",
    boxShadow:
      "0 15px 45px rgba(25,55,100,0.14)",
    border:
      "1px solid rgba(220,228,240,0.9)",
    marginBottom: "35px"
  },


  searchHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "25px"
  },


  searchTitle: {
    margin: 0,
    fontSize: "24px",
    fontWeight: "800",
    color: "#172033"
  },


  searchSubtitle: {
    margin:
      "6px 0 0",
    color: "#6b7280",
    fontSize: "14px"
  },


  searchIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    background: "#eaf3ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "21px"
  },


  searchForm: {
    display: "grid",
    gridTemplateColumns:
      "1fr auto 1fr 1fr auto",
    alignItems: "end",
    gap: "14px"
  },


  field: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    minWidth: 0
  },


  label: {
    fontSize: "11px",
    fontWeight: "800",
    color: "#64748b",
    letterSpacing: "0.8px"
  },


  inputWrapper: {
    height: "50px",
    display: "flex",
    alignItems: "center",
    border:
      "1px solid #d8e0ea",
    borderRadius: "11px",
    background: "#fbfcfe",
    boxSizing: "border-box"
  },


  inputIcon: {
    paddingLeft: "13px",
    fontSize: "16px"
  },


  input: {
    width: "100%",
    height: "100%",
    border: "none",
    outline: "none",
    background: "transparent",
    padding: "0 12px 0 8px",
    fontSize: "14px",
    color: "#172033",
    boxSizing: "border-box"
  },


  swapButton: {
    width: "40px",
    height: "40px",
    marginBottom: "5px",
    borderRadius: "50%",
    border:
      "1px solid #cbdcf5",
    background: "#ffffff",
    color: "#1976d2",
    fontSize: "21px",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow:
      "0 3px 10px rgba(25,118,210,0.12)"
  },


  searchButton: {
    height: "50px",
    padding: "0 22px",
    border: "none",
    borderRadius: "11px",
    background:
      "linear-gradient(135deg, #1565c0, #1976d2)",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "800",
    cursor: "pointer",
    whiteSpace: "nowrap",
    boxShadow:
      "0 6px 16px rgba(25,118,210,0.25)"
  },


  disabledButton: {
    opacity: 0.65,
    cursor: "not-allowed"
  },


  spinner: {
    display: "inline-block",
    marginRight: "7px",
    fontSize: "17px"
  },


  // ===================================================
  // ERROR
  // ===================================================

  errorBox: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "17px 20px",
    marginBottom: "25px",
    background: "#fff5f5",
    border:
      "1px solid #fecaca",
    borderRadius: "13px",
    color: "#991b1b"
  },


  errorIcon: {
    width: "34px",
    height: "34px",
    flexShrink: 0,
    borderRadius: "50%",
    background: "#fee2e2",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900"
  },


  errorText: {
    margin: "4px 0 0",
    fontSize: "14px"
  },


  // ===================================================
  // LOADING
  // ===================================================

  loadingCard: {
    textAlign: "center",
    background: "#ffffff",
    padding: "50px 25px",
    borderRadius: "18px",
    border:
      "1px solid #e5eaf1",
    boxShadow:
      "0 8px 25px rgba(0,0,0,0.05)"
  },


  loadingIcon: {
    fontSize: "40px",
    marginBottom: "10px"
  },


  // ===================================================
  // RESULTS HEADER
  // ===================================================

  resultsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "22px",
    flexWrap: "wrap"
  },


  resultsLabel: {
    color: "#1976d2",
    fontSize: "11px",
    fontWeight: "900",
    letterSpacing: "1px"
  },


  resultsTitle: {
    margin: "4px 0 0",
    fontSize: "26px",
    color: "#172033"
  },


  tripSummary: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 14px",
    background: "#ffffff",
    border:
      "1px solid #e1e8f0",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: "700",
    color: "#475569",
    flexWrap: "wrap"
  },


  arrow: {
    color: "#1976d2",
    fontSize: "18px"
  },


  dateBadge: {
    padding: "5px 9px",
    background: "#edf5ff",
    color: "#1565c0",
    borderRadius: "6px"
  },


  // ===================================================
  // EMPTY
  // ===================================================

  emptyCard: {
    textAlign: "center",
    padding: "70px 25px",
    background: "#ffffff",
    borderRadius: "20px",
    border:
      "1px solid #e5eaf1",
    boxShadow:
      "0 8px 25px rgba(0,0,0,0.04)"
  },


  emptyIcon: {
    width: "80px",
    height: "80px",
    margin: "0 auto 18px",
    borderRadius: "50%",
    background: "#edf5ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "38px"
  },


  // ===================================================
  // RESULTS GRID
  // ===================================================

  resultsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(420px, 1fr))",
    gap: "22px"
  },


  // ===================================================
  // BUS CARD
  // ===================================================

  busCard: {
    background: "#ffffff",
    border:
      "1px solid #e1e8f0",
    borderRadius: "18px",
    padding: "22px",
    boxShadow:
      "0 7px 25px rgba(22,40,70,0.07)",
    transition:
      "transform 0.2s ease, box-shadow 0.2s ease"
  },


  busCardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "15px",
    paddingBottom: "18px",
    borderBottom:
      "1px solid #edf0f4"
  },


  busBrand: {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },


  busIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "13px",
    background:
      "linear-gradient(135deg, #e7f1ff, #dcecff)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "23px"
  },


  busName: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "800",
    color: "#172033"
  },


  busNumber: {
    margin: "4px 0 0",
    color: "#64748b",
    fontSize: "13px"
  },


  busType: {
    padding: "7px 10px",
    borderRadius: "20px",
    background: "#f1f5f9",
    color: "#475569",
    fontSize: "11px",
    fontWeight: "800",
    textTransform: "uppercase"
  },


  // ===================================================
  // ROUTE
  // ===================================================

  routeSection: {
    display: "grid",
    gridTemplateColumns:
      "1fr 1.2fr 1fr",
    alignItems: "center",
    gap: "12px",
    padding: "24px 0"
  },


  location: {
    display: "flex",
    flexDirection: "column",
    gap: "4px"
  },


  locationTime: {
    fontSize: "20px",
    fontWeight: "900",
    color: "#172033"
  },


  routeSectionStrong: {
    fontSize: "14px"
  },


  routeLine: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    gap: "5px"
  },


  routeDot: {
    color: "#1976d2",
    fontSize: "12px"
  },


  line: {
    height: "2px",
    flex: 1,
    background:
      "linear-gradient(90deg, #1976d2, #90caf9)"
  },


  routeBus: {
    fontSize: "18px"
  },


  // ===================================================
  // DETAILS
  // ===================================================

  detailsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, 1fr)",
    gap: "10px",
    padding:
      "16px 0",
    borderTop:
      "1px solid #edf0f4",
    borderBottom:
      "1px solid #edf0f4"
  },


  detailItem: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    minWidth: 0
  },


  detailIcon: {
    fontSize: "17px"
  },


  detailItemSmall: {
    display: "block"
  },


  // ===================================================
  // CARD FOOTER
  // ===================================================

  cardFooter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "15px",
    paddingTop: "18px"
  },


  priceLabel: {
    display: "block",
    color: "#64748b",
    fontSize: "11px",
    marginBottom: "3px"
  },


  price: {
    fontSize: "24px",
    fontWeight: "900",
    color: "#172033"
  },


  perSeat: {
    fontSize: "12px",
    color: "#64748b",
    fontWeight: "500"
  },


  selectButton: {
    border: "none",
    borderRadius: "10px",
    padding: "12px 18px",
    background:
      "linear-gradient(135deg, #1565c0, #1976d2)",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "800",
    cursor: "pointer",
    transition:
      "transform 0.2s ease, box-shadow 0.2s ease"
  },


  buttonArrow: {
    marginLeft: "9px",
    fontSize: "17px"
  }

};


export default BusSearch;
