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

  const handleChange = (e) => {
    setForm((previous) => ({
      ...previous,
      [e.target.name]: e.target.value
    }));
  };

  const searchBuses = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setBuses([]);

    try {
      const response = await api.get("/buses/search", {
        params: {
          from: form.from,
          to: form.to,
          date: form.date
        }
      });

      console.log("Search response:", response.data);

      const result = response.data.buses || response.data;

      if (Array.isArray(result)) {
        setBuses(result);
      } else {
        setBuses([]);
        setError("No buses found");
      }
    } catch (error) {
      console.error("Bus search error:", error);

      setError(
        error.response?.data?.message ||
        "Unable to search buses"
      );
    } finally {
      setLoading(false);
    }
  };

  const selectBus = (bus) => {
    console.log("SELECTED BUS:", bus);

    if (!bus.schedule_id) {
        alert("Schedule ID is missing from this bus.");
        return;
    }

    navigate("/seats", {
        state: {
        bus,
        scheduleId: bus.schedule_id,
        travelDate: form.date,
        from: form.from,
        to: form.to
        }
    });
  };

  return (
    <div style={styles.page}>

      <h1>Search Buses</h1>

      <form
        onSubmit={searchBuses}
        style={styles.searchBox}
      >

        {/* From */}

        <div style={styles.field}>
          <label>From</label>

          <input
            style={styles.input}
            name="from"
            placeholder="Bangalore"
            value={form.from}
            onChange={handleChange}
            required
          />
        </div>


        {/* To */}

        <div style={styles.field}>
          <label>To</label>

          <input
            style={styles.input}
            name="to"
            placeholder="Shimoga"
            value={form.to}
            onChange={handleChange}
            required
          />
        </div>


        {/* Date */}

        <div style={styles.field}>
          <label>Date</label>

          <input
            style={styles.input}
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />
        </div>


        {/* Search */}

        <button
          type="submit"
          style={styles.searchButton}
          disabled={loading}
        >
          {loading
            ? "Searching..."
            : "Search Buses"}
        </button>

      </form>


      {/* Error */}

      {error && (
        <div style={styles.error}>
          {error}
        </div>
      )}


      {/* Results */}

      <div style={styles.results}>

        {buses.length === 0 &&
          !loading &&
          !error && (
            <p>
              Enter your journey details and search.
            </p>
          )}


        {buses.map((bus) => (

          <div
            key={bus.schedule_id}
            style={styles.card}
          >

            <h2>
              {bus.bus_name ||
                bus.name ||
                "Bus"}
            </h2>


            <p>
              <strong>
                Bus Number:
              </strong>{" "}
              {bus.bus_number ||
                bus.busNumber ||
                "-"}
            </p>


            <p>
              <strong>
                Bus Type:
              </strong>{" "}
              {bus.bus_type ||
                bus.busType ||
                "-"}
            </p>


            <p>
              <strong>
                From:
              </strong>{" "}
              {bus.from ||
                bus.source ||
                form.from}
            </p>


            <p>
              <strong>
                To:
              </strong>{" "}
              {bus.to ||
                bus.destination ||
                form.to}
            </p>


            <p>
              <strong>
                Total Seats:
              </strong>{" "}
              {bus.total_seats ||
                bus.totalSeats ||
                "-"}
            </p>


            <p>
              <strong>
                Price:
              </strong>{" "}
              ₹
              {bus.price ||
                bus.fare ||
                "-"}
            </p>


            <button
              type="button"
              style={styles.selectButton}
              onClick={() => selectBus(bus)}
            >
              Select Bus
            </button>

          </div>

        ))}

      </div>

    </div>
  );
}


const styles = {

  page: {
    padding: "40px",
    maxWidth: "1100px",
    margin: "auto"
  },


  searchBox: {
    display: "flex",
    gap: "15px",
    alignItems: "flex-end",
    padding: "25px",
    background: "#f5f5f5",
    borderRadius: "10px",
    marginBottom: "30px",
    flexWrap: "wrap"
  },


  field: {
    display: "flex",
    flexDirection: "column",
    gap: "5px"
  },


  input: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px"
  },


  searchButton: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    background: "#1976d2",
    color: "white"
  },


  results: {
    display: "grid",
    gap: "20px"
  },


  card: {
    padding: "25px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    background: "white",
    boxShadow:
      "0 2px 8px rgba(0,0,0,0.08)"
  },


  selectButton: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    background: "#1976d2",
    color: "white"
  },


  error: {
    color: "red",
    marginBottom: "20px"
  }

};


export default BusSearch;