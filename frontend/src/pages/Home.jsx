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

  const navigate = useNavigate();


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
  // NOT LOGGED IN
  // =====================================================

  if (!user) {

    return (

      <div style={styles.page}>

        <nav style={styles.navbar}>

          <div style={styles.logo}>
            🚌 Bus Booking
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

        </nav>


        <div style={styles.notLoggedIn}>

          <div style={styles.notLoggedIcon}>
            🚌
          </div>

          <h1 style={styles.notLoggedHeading}>
            Welcome to Bus Booking
          </h1>

          <p style={styles.notLoggedText}>
            Search buses, choose your seats and
            book your journey easily.
          </p>

          <Link
            to="/login"
            style={styles.primaryButton}
          >
            Login to Continue →
          </Link>

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

        <Link
          to="/"
          style={styles.logo}
        >
          🚌 Bus Booking
        </Link>


        <div style={styles.navLinks}>

          <Link
            to="/"
            style={styles.activeNavLink}
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


          {/* USER */}

          <div style={styles.userArea}>

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

              <strong style={styles.userName}>
                {user.name ||
                  user.username ||
                  "User"}
              </strong>

              <span style={styles.userEmail}>
                {user.email}
              </span>

            </div>


            <button
              type="button"
              onClick={handleLogout}
              style={styles.logoutButton}
            >
              Logout
            </button>

          </div>

        </div>

      </nav>


      {/* =================================================
          HERO
      ================================================= */}

      <main>

        <section style={styles.hero}>

          <div style={styles.heroContent}>

            <div style={styles.heroText}>

              <div style={styles.welcomeBadge}>
                ✨ Welcome back
              </div>


              <h1 style={styles.heroHeading}>

                Hello,{" "}

                <span style={styles.heroName}>
                  {user.name ||
                    user.email}
                </span>

                ! 👋

              </h1>


              <p style={styles.heroDescription}>
                Your next journey is just a few
                clicks away. Find the perfect bus,
                choose your favourite seat and
                travel comfortably.
              </p>


              <div style={styles.heroButtons}>

                <Link
                  to="/search"
                  style={styles.heroPrimaryButton}
                >
                  🔎 Search Buses
                </Link>


                <Link
                  to="/my-bookings"
                  style={styles.heroSecondaryButton}
                >
                  🎫 My Bookings
                </Link>

              </div>

            </div>


            {/* BUS VISUAL */}

            <div style={styles.busVisual}>

              <div style={styles.busCircle}>
                🚌
              </div>

              <div style={styles.floatingCard}>

                <span style={styles.floatingIcon}>
                  ⭐
                </span>

                <div>

                  <strong style={styles.floatingTitle}>
                    Easy Booking
                  </strong>

                  <span style={styles.floatingText}>
                    Fast & secure
                  </span>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* =================================================
            QUICK ACTIONS
        ================================================= */}

        <section style={styles.content}>

          <div style={styles.sectionHeader}>

            <div>

              <span style={styles.sectionLabel}>
                GET STARTED
              </span>

              <h2 style={styles.sectionTitle}>
                Plan your journey
              </h2>

              <p style={styles.sectionDescription}>
                Everything you need for a smooth
                bus booking experience.
              </p>

            </div>

          </div>


          <div style={styles.actionGrid}>

            {/* SEARCH */}

            <Link
              to="/search"
              style={styles.actionCard}
            >

              <div style={styles.actionIconBlue}>
                🔎
              </div>

              <div>

                <h3 style={styles.actionTitle}>
                  Search Buses
                </h3>

                <p style={styles.actionText}>
                  Find buses by source,
                  destination and travel date.
                </p>

                <span style={styles.actionLink}>
                  Find a bus →
                </span>

              </div>

            </Link>


            {/* BOOKINGS */}

            <Link
              to="/my-bookings"
              style={styles.actionCard}
            >

              <div style={styles.actionIconGreen}>
                🎫
              </div>

              <div>

                <h3 style={styles.actionTitle}>
                  My Bookings
                </h3>

                <p style={styles.actionText}>
                  View your booked journeys,
                  seats and booking details.
                </p>

                <span style={styles.actionLink}>
                  View bookings →
                </span>

              </div>

            </Link>


            {/* PROFILE */}

            <div style={styles.actionCard}>

              <div style={styles.actionIconPurple}>
                👤
              </div>

              <div>

                <h3 style={styles.actionTitle}>
                  My Profile
                </h3>

                <p style={styles.actionText}>
                  Manage and view your account
                  information.
                </p>

                <span style={styles.profileStatus}>
                  ✓ Account active
                </span>

              </div>

            </div>

          </div>


          {/* =================================================
              FEATURES
          ================================================= */}

          <section style={styles.featuresSection}>

            <div style={styles.sectionHeaderCenter}>

              <span style={styles.sectionLabel}>
                WHY BUS BOOKING
              </span>

              <h2 style={styles.sectionTitle}>
                Travel made simple
              </h2>

            </div>


            <div style={styles.featureGrid}>

              <div style={styles.featureCard}>

                <div style={styles.featureIcon}>
                  ⚡
                </div>

                <h3 style={styles.featureTitle}>
                  Fast Booking
                </h3>

                <p style={styles.featureText}>
                  Search available buses and
                  complete your booking quickly.
                </p>

              </div>


              <div style={styles.featureCard}>

                <div style={styles.featureIcon}>
                  💺
                </div>

                <h3 style={styles.featureTitle}>
                  Choose Your Seat
                </h3>

                <p style={styles.featureText}>
                  Select the seat that works
                  best for your journey.
                </p>

              </div>


              <div style={styles.featureCard}>

                <div style={styles.featureIcon}>
                  🔒
                </div>

                <h3 style={styles.featureTitle}>
                  Secure Booking
                </h3>

                <p style={styles.featureText}>
                  Your booking information is
                  securely managed.
                </p>

              </div>


              <div style={styles.featureCard}>

                <div style={styles.featureIcon}>
                  🎯
                </div>

                <h3 style={styles.featureTitle}>
                  Easy Management
                </h3>

                <p style={styles.featureText}>
                  View your bookings and manage
                  your journeys from one place.
                </p>

              </div>

            </div>

          </section>


          {/* =================================================
              PROFILE
          ================================================= */}

          <section style={styles.profileSection}>

            <div style={styles.profileHeader}>

              <div style={styles.largeAvatar}>

                {(
                  user.name ||
                  user.email ||
                  "U"
                )
                  .charAt(0)
                  .toUpperCase()}

              </div>


              <div>

                <span style={styles.sectionLabel}>
                  YOUR ACCOUNT
                </span>

                <h2 style={styles.profileTitle}>
                  My Profile
                </h2>

              </div>

            </div>


            <div style={styles.profileDetails}>

              <div style={styles.profileDetail}>

                <span style={styles.detailLabel}>
                  Full Name
                </span>

                <strong style={styles.detailValue}>
                  {user.name || "-"}
                </strong>

              </div>


              <div style={styles.profileDetail}>

                <span style={styles.detailLabel}>
                  Email Address
                </span>

                <strong style={styles.detailValue}>
                  {user.email || "-"}
                </strong>

              </div>


              <div style={styles.profileDetail}>

                <span style={styles.detailLabel}>
                  Phone Number
                </span>

                <strong style={styles.detailValue}>
                  {user.phone || "-"}
                </strong>

              </div>


              <div style={styles.profileDetail}>

                <span style={styles.detailLabel}>
                  Account Role
                </span>

                <strong style={styles.roleBadge}>
                  {user.role || "CUSTOMER"}
                </strong>

              </div>

            </div>


            <div style={styles.profileActions}>

              <Link
                to="/my-bookings"
                style={styles.profileBookingButton}
              >
                View My Bookings
              </Link>


              <button
                type="button"
                onClick={handleLogout}
                style={styles.profileLogoutButton}
              >
                Logout
              </button>

            </div>

          </section>

        </section>

      </main>


      {/* =================================================
          FOOTER
      ================================================= */}

      <footer style={styles.footer}>

        <div style={styles.footerLogo}>
          🚌 Bus Booking
        </div>

        <p style={styles.footerText}>
          Book your journey. Choose your seat.
          Travel with confidence.
        </p>

        <span style={styles.footerCopyright}>
          © 2026 Bus Booking System
        </span>

      </footer>

    </div>

  );
}


// =====================================================
// STYLES
// =====================================================

const styles = {

  page: {
    minHeight: "100vh",
    background: "#f5f7fb",
    color: "#172033",
    fontFamily:
      "Arial, Helvetica, sans-serif"
  },


  // ===================================================
  // NAVBAR
  // ===================================================

  navbar: {
    minHeight: "72px",
    padding: "0 45px",
    background: "#ffffff",
    borderBottom:
      "1px solid #e8ebf2",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxSizing: "border-box",
    position: "sticky",
    top: 0,
    zIndex: 100
  },


  logo: {
    textDecoration: "none",
    fontSize: "24px",
    fontWeight: "800",
    color: "#1769e0",
    whiteSpace: "nowrap"
  },


  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "25px"
  },


  navLink: {
    textDecoration: "none",
    color: "#4b5568",
    fontWeight: "600",
    fontSize: "15px"
  },


  activeNavLink: {
    textDecoration: "none",
    color: "#1769e0",
    fontWeight: "700",
    fontSize: "15px"
  },


  loginLink: {
    textDecoration: "none",
    color: "#1769e0",
    fontWeight: "700"
  },


  registerButton: {
    textDecoration: "none",
    padding: "10px 18px",
    background: "#1769e0",
    color: "#ffffff",
    borderRadius: "8px",
    fontWeight: "700"
  },


  // ===================================================
  // USER AREA
  // ===================================================

  userArea: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    paddingLeft: "20px",
    borderLeft: "1px solid #e1e5ec"
  },


  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background:
      "linear-gradient(135deg, #1769e0, #5b8def)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    fontSize: "17px"
  },


  userInfo: {
    display: "flex",
    flexDirection: "column",
    minWidth: "115px"
  },


  userName: {
    color: "#172033",
    fontSize: "14px"
  },


  userEmail: {
    color: "#8992a3",
    fontSize: "12px",
    marginTop: "3px"
  },


  logoutButton: {
    border: "none",
    padding: "9px 14px",
    borderRadius: "7px",
    background: "#ef4444",
    color: "#ffffff",
    fontWeight: "700",
    cursor: "pointer"
  },


  // ===================================================
  // HERO
  // ===================================================

  hero: {
    margin: "0",
    background:
      "linear-gradient(135deg, #1769e0 0%, #2f80ed 55%, #5b8def 100%)",
    color: "#ffffff",
    overflow: "hidden"
  },


  heroContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "75px 45px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "50px",
    boxSizing: "border-box"
  },


  heroText: {
    maxWidth: "650px"
  },


  welcomeBadge: {
    display: "inline-block",
    padding: "8px 15px",
    borderRadius: "30px",
    background: "rgba(255,255,255,0.16)",
    border:
      "1px solid rgba(255,255,255,0.25)",
    fontSize: "14px",
    fontWeight: "700",
    marginBottom: "18px"
  },


  heroHeading: {
    margin: "0",
    fontSize: "52px",
    lineHeight: "1.12",
    fontWeight: "800",
    letterSpacing: "-1px"
  },


  heroName: {
    color: "#dceaff"
  },


  heroDescription: {
    marginTop: "22px",
    marginBottom: "30px",
    fontSize: "18px",
    lineHeight: "1.7",
    color: "#eaf2ff",
    maxWidth: "600px"
  },


  heroButtons: {
    display: "flex",
    gap: "14px",
    flexWrap: "wrap"
  },


  heroPrimaryButton: {
    display: "inline-block",
    padding: "14px 23px",
    background: "#ffffff",
    color: "#1769e0",
    textDecoration: "none",
    borderRadius: "9px",
    fontWeight: "800",
    boxShadow:
      "0 8px 20px rgba(0,0,0,0.15)"
  },


  heroSecondaryButton: {
    display: "inline-block",
    padding: "14px 23px",
    background: "rgba(255,255,255,0.12)",
    color: "#ffffff",
    textDecoration: "none",
    borderRadius: "9px",
    fontWeight: "700",
    border:
      "1px solid rgba(255,255,255,0.35)"
  },


  // ===================================================
  // BUS VISUAL
  // ===================================================

  busVisual: {
    width: "300px",
    height: "300px",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },


  busCircle: {
    width: "220px",
    height: "220px",
    borderRadius: "50%",
    background:
      "rgba(255,255,255,0.13)",
    border:
      "1px solid rgba(255,255,255,0.25)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "110px",
    boxShadow:
      "0 20px 50px rgba(0,0,0,0.12)"
  },


  floatingCard: {
    position: "absolute",
    right: "-5px",
    bottom: "25px",
    background: "#ffffff",
    color: "#172033",
    padding: "14px 18px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    boxShadow:
      "0 12px 30px rgba(0,0,0,0.18)"
  },


  floatingIcon: {
    fontSize: "25px"
  },


  floatingTitle: {
    display: "block",
    fontSize: "14px"
  },


  floatingText: {
    display: "block",
    fontSize: "12px",
    color: "#7c8799",
    marginTop: "3px"
  },


  // ===================================================
  // CONTENT
  // ===================================================

  content: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "55px 45px",
    boxSizing: "border-box"
  },


  sectionHeader: {
    marginBottom: "28px"
  },


  sectionHeaderCenter: {
    textAlign: "center",
    marginBottom: "35px"
  },


  sectionLabel: {
    color: "#1769e0",
    fontSize: "12px",
    fontWeight: "800",
    letterSpacing: "1.5px"
  },


  sectionTitle: {
    margin: "7px 0",
    color: "#172033",
    fontSize: "30px",
    fontWeight: "800"
  },


  sectionDescription: {
    margin: "0",
    color: "#778196",
    fontSize: "15px"
  },


  // ===================================================
  // ACTION CARDS
  // ===================================================

  actionGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, 1fr)",
    gap: "20px"
  },


  actionCard: {
    textDecoration: "none",
    background: "#ffffff",
    borderRadius: "16px",
    padding: "25px",
    display: "flex",
    gap: "18px",
    alignItems: "flex-start",
    boxShadow:
      "0 5px 20px rgba(30,50,90,0.07)",
    border:
      "1px solid #edf0f5",
    transition:
      "transform 0.2s ease, box-shadow 0.2s ease",
    color: "#172033"
  },


  actionIconBlue: {
    minWidth: "52px",
    height: "52px",
    borderRadius: "13px",
    background: "#e8f1ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px"
  },


  actionIconGreen: {
    minWidth: "52px",
    height: "52px",
    borderRadius: "13px",
    background: "#e8f8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px"
  },


  actionIconPurple: {
    minWidth: "52px",
    height: "52px",
    borderRadius: "13px",
    background: "#f0eaff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px"
  },


  actionTitle: {
    margin: "0 0 7px",
    color: "#172033",
    fontSize: "18px"
  },


  actionText: {
    margin: "0 0 12px",
    color: "#778196",
    fontSize: "14px",
    lineHeight: "1.6"
  },


  actionLink: {
    color: "#1769e0",
    fontSize: "13px",
    fontWeight: "800"
  },


  profileStatus: {
    color: "#16a36a",
    fontSize: "13px",
    fontWeight: "700"
  },


  // ===================================================
  // FEATURES
  // ===================================================

  featuresSection: {
    marginTop: "70px"
  },


  featureGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, 1fr)",
    gap: "18px"
  },


  featureCard: {
    background: "#ffffff",
    borderRadius: "14px",
    padding: "25px",
    textAlign: "center",
    border:
      "1px solid #edf0f5"
  },


  featureIcon: {
    width: "52px",
    height: "52px",
    margin: "0 auto 15px",
    borderRadius: "50%",
    background: "#eef4ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "23px"
  },


  featureTitle: {
    margin: "0 0 8px",
    color: "#172033",
    fontSize: "17px"
  },


  featureText: {
    margin: "0",
    color: "#7a8497",
    fontSize: "13px",
    lineHeight: "1.6"
  },


  // ===================================================
  // PROFILE
  // ===================================================

  profileSection: {
    marginTop: "70px",
    background: "#ffffff",
    borderRadius: "18px",
    padding: "30px",
    boxShadow:
      "0 5px 20px rgba(30,50,90,0.07)",
    border:
      "1px solid #edf0f5"
  },


  profileHeader: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "25px"
  },


  largeAvatar: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    background:
      "linear-gradient(135deg, #1769e0, #5b8def)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "25px",
    fontWeight: "800"
  },


  profileTitle: {
    margin: "5px 0 0",
    color: "#172033",
    fontSize: "26px"
  },


  profileDetails: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, 1fr)",
    borderTop:
      "1px solid #edf0f5",
    borderBottom:
      "1px solid #edf0f5"
  },


  profileDetail: {
    padding: "20px",
    borderRight:
      "1px solid #edf0f5"
  },


  detailLabel: {
    display: "block",
    color: "#8992a3",
    fontSize: "12px",
    marginBottom: "7px"
  },


  detailValue: {
    color: "#273248",
    fontSize: "14px",
    wordBreak: "break-word"
  },


  roleBadge: {
    display: "inline-block",
    padding: "5px 10px",
    background: "#e8f8f0",
    color: "#138a59",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "800"
  },


  profileActions: {
    display: "flex",
    gap: "12px",
    marginTop: "25px"
  },


  profileBookingButton: {
    display: "inline-block",
    padding: "11px 18px",
    background: "#1769e0",
    color: "#ffffff",
    textDecoration: "none",
    borderRadius: "8px",
    fontWeight: "700"
  },


  profileLogoutButton: {
    padding: "11px 18px",
    background: "#ffffff",
    color: "#ef4444",
    border:
      "1px solid #ef4444",
    borderRadius: "8px",
    fontWeight: "700",
    cursor: "pointer"
  },


  // ===================================================
  // FOOTER
  // ===================================================

  footer: {
    background: "#111827",
    color: "#ffffff",
    textAlign: "center",
    padding: "40px 20px",
    marginTop: "20px"
  },


  footerLogo: {
    fontSize: "20px",
    fontWeight: "800"
  },


  footerText: {
    color: "#aeb7c6",
    fontSize: "14px",
    margin: "10px 0 20px"
  },


  footerCopyright: {
    color: "#707b8e",
    fontSize: "12px"
  },


  // ===================================================
  // NOT LOGGED IN
  // ===================================================

  notLoggedIn: {
    maxWidth: "700px",
    margin: "100px auto",
    textAlign: "center",
    padding: "40px 25px"
  },


  notLoggedIcon: {
    fontSize: "70px",
    marginBottom: "20px"
  },


  notLoggedHeading: {
    color: "#172033",
    fontSize: "38px",
    margin: "0 0 15px"
  },


  notLoggedText: {
    color: "#707b8e",
    fontSize: "18px",
    lineHeight: "1.6",
    marginBottom: "30px"
  },


  primaryButton: {
    display: "inline-block",
    padding: "14px 24px",
    background: "#1769e0",
    color: "#ffffff",
    textDecoration: "none",
    borderRadius: "9px",
    fontWeight: "800"
  }

};


export default Home;