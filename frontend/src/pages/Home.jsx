import { useAuth } from "../context/AuthContext";

function Home() {

  const { user, logout } = useAuth();

  return (
    <div>

      <nav style={styles.nav}>

        <h2>Bus Booking</h2>

        <div>

          <span>
            Welcome, {user?.name}
          </span>

          <button
            onClick={logout}
            style={styles.button}
          >
            Logout
          </button>

        </div>

      </nav>

      <main style={styles.main}>

        <h1>Find Your Bus</h1>

        <p>
          Search buses, select your seat
          and complete your booking.
        </p>

        <button>
          Search Buses
        </button>

      </main>

    </div>
  );
}

const styles = {
  nav: {
    padding: "15px 30px",
    display: "flex",
    justifyContent: "space-between",
    background: "#222",
    color: "white"
  },

  button: {
    marginLeft: "20px"
  },

  main: {
    padding: "50px",
    textAlign: "center"
  }
};

export default Home;