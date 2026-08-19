
import {
  Link,
  useNavigate
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";


function Home() {

  const {
    user,
    logout
  } = useAuth();

  const navigate =
    useNavigate();


  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {

    logout();

    navigate("/login", {
      replace: true
    });

  };


  // =====================================================
  // IF USER IS NOT AVAILABLE
  // =====================================================

  if (!user) {

    return (

      <div style={styles.page}>

        <div style={styles.navbar}>

          <div style={styles.logo}>
            Bus Booking
          </div>

          <div style={styles.navLinks}>

            <Link
              to="/login"
              style={styles.loginLink}
            >
              Login
            </Link>

            <Link
              to="/register"
              style={styles.registerButton}
            >
              Register
            </Link>

          </div>

        </div>


        <div style={styles.center}>

          <h1>
            Welcome to Bus Booking
          </h1>

          <p>
            Please login to continue.
          </p>

        </div>

      </div>

    );
  }


  // =====================================================
  // LOGGED-IN HOME
  // =====================================================

  return (

    <div style={styles.page}>

      {/* =================================================
          NAVBAR
      ================================================= */}

      <nav style={styles.navbar}>

        {/* LOGO */}

        <div style={styles.logo}>
          Bus Booking
        </div>


        {/* NAVIGATION */}

        <div style={styles.navLinks}>

          <Link
            to="/"
            style={styles.navLink}
          >
            Home
          </Link>


          <Link
            to="/search"
            style={styles.navLink}
          >
            Search Buses
          </Link>


          <Link
            to="/my-bookings"
            style={styles.navLink}
          >
            My Bookings
          </Link>


          {/* ===========================================
              USER PROFILE
          =========================================== */}

          <div style={styles.profile}>

            <div style={styles.avatar}>
              {(
                user.name ||
                user.email ||
                "U"
              )
                .charAt(0)
                .toUpperCase()}
            </div>


            <div style={styles.userInfo}>

              <strong>
                {user.name ||
                  user.username ||
                  "User"}
              </strong>

              <span>
                {user.email}
              </span>

            </div>


            {/* LOGOUT */}

            <button
              type="button"
              onClick={
                handleLogout
              }
              style={styles.logoutButton}
            >
              Logout
            </button>

          </div>

        </div>

      </nav>


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main style={styles.content}>

        <div style={styles.welcomeCard}>

          <div>

            <p style={styles.smallText}>
              Welcome back
            </p>

            <h1>
              Hello,{" "}
              {user.name ||
                user.email}
              ! 👋
            </h1>

            <p>
              Find your next bus journey
              and book your seats easily.
            </p>

          </div>


          <Link
            to="/search"
            style={styles.searchButton}
          >
            Search Buses
          </Link>

        </div>


        {/* =================================================
            USER PROFILE CARD
        ================================================= */}

        <div style={styles.profileCard}>

          <h2>
            My Profile
          </h2>


          <div style={styles.profileRow}>

            <strong>
              Name
            </strong>

            <span>
              {user.name || "-"}
            </span>

          </div>


          <div style={styles.profileRow}>

            <strong>
              Email
            </strong>

            <span>
              {user.email || "-"}
            </span>

          </div>


          <div style={styles.profileRow}>

            <strong>
              Phone
            </strong>

            <span>
              {user.phone || "-"}
            </span>

          </div>


          <div style={styles.profileRow}>

            <strong>
              Role
            </strong>

            <span>
              {user.role || "USER"}
            </span>

          </div>


          <div style={styles.profileActions}>

            <Link
              to="/my-bookings"
              style={styles.bookingButton}
            >
              View My Bookings
            </Link>


            <button
              type="button"
              onClick={
                handleLogout
              }
              style={styles.logoutLarge}
            >
              Logout
            </button>

          </div>

        </div>

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
    background: "#f4f6f8"
  },


  // ===================================================
  // NAVBAR
  // ===================================================

  navbar: {
    height: "70px",
    padding: "0 35px",
    background: "#ffffff",
    borderBottom:
      "1px solid #e5e5e5",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxSizing: "border-box"
  },


  logo: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#1976d2"
  },


  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "22px"
  },


  navLink: {
    textDecoration: "none",
    color: "#333",
    fontWeight: "500"
  },


  loginLink: {
    textDecoration: "none",
    color: "#1976d2",
    fontWeight: "bold"
  },


  registerButton: {
    textDecoration: "none",
    padding: "9px 16px",
    background: "#1976d2",
    color: "#fff",
    borderRadius: "6px",
    fontWeight: "bold"
  },


  // ===================================================
  // PROFILE
  // ===================================================

  profile: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginLeft: "10px",
    paddingLeft: "18px",
    borderLeft:
      "1px solid #ddd"
  },


  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "#1976d2",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "18px"
  },


  userInfo: {
    display: "flex",
    flexDirection: "column",
    minWidth: "120px"
  },


  logoutButton: {
    border: "none",
    padding: "9px 14px",
    borderRadius: "6px",
    background: "#d32f2f",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer"
  },


  // ===================================================
  // MAIN
  // ===================================================

  content: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "40px 25px"
  },


  welcomeCard: {
    padding: "35px",
    background: "#ffffff",
    borderRadius: "12px",
    boxShadow:
      "0 3px 12px rgba(0,0,0,0.08)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "30px"
  },


  smallText: {
    color: "#1976d2",
    fontWeight: "bold",
    marginBottom: "5px"
  },


  searchButton: {
    display: "inline-block",
    padding: "13px 22px",
    background: "#1976d2",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "7px",
    fontWeight: "bold"
  },


  // ===================================================
  // PROFILE CARD
  // ===================================================

  profileCard: {
    marginTop: "25px",
    padding: "30px",
    background: "#ffffff",
    borderRadius: "12px",
    boxShadow:
      "0 3px 12px rgba(0,0,0,0.08)"
  },


  profileRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "14px 0",
    borderBottom:
      "1px solid #eeeeee"
  },


  profileActions: {
    marginTop: "25px",
    display: "flex",
    gap: "12px"
  },


  bookingButton: {
    padding: "11px 18px",
    background: "#1976d2",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "6px",
    fontWeight: "bold"
  },


  logoutLarge: {
    padding: "11px 18px",
    background: "#d32f2f",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer"
  },


  // ===================================================
  // NOT LOGGED IN
  // ===================================================

  center: {
    maxWidth: "700px",
    margin: "100px auto",
    textAlign: "center"
  }

};


export default Home;
