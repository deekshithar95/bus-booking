import { useState } from "react";
import {
  useNavigate,
  Link
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";


function Login() {

  const navigate = useNavigate();

  const {
    login,
    loading
  } = useAuth();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);


  // ===================================================
  // LOGIN
  // ===================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    const result =
      await login(
        email,
        password
      );

    console.log(
      "LOGIN RESULT:",
      result
    );

    if (!result.success) {

      setError(
        result.message
      );

      return;
    }

    navigate("/", {
      replace: true
    });
  };


  // ===================================================
  // UI
  // ===================================================

  return (

    <div style={styles.page}>

      {/* =================================================
          LEFT SIDE - BRANDING
      ================================================= */}

      <div style={styles.leftSection}>

        <div style={styles.brandContent}>

          <div style={styles.logoCircle}>
            🚌
          </div>

          <h1 style={styles.brandTitle}>
            Bus<span>Go</span>
          </h1>

          <h2 style={styles.heroTitle}>
            Travel smarter.
            <br />
            Travel better.
          </h2>

          <p style={styles.heroText}>
            Book your bus tickets quickly and
            securely. Find the perfect journey
            and travel with confidence.
          </p>


          {/* FEATURES */}

          <div style={styles.features}>

            <div style={styles.feature}>
              <div style={styles.featureIcon}>
                ✓
              </div>

              <div>
                <strong>
                  Easy Booking
                </strong>

                <span>
                  Book your seat in seconds
                </span>
              </div>
            </div>


            <div style={styles.feature}>
              <div style={styles.featureIcon}>
                🛡
              </div>

              <div>
                <strong>
                  Secure & Reliable
                </strong>

                <span>
                  Your information is protected
                </span>
              </div>
            </div>


            <div style={styles.feature}>
              <div style={styles.featureIcon}>
                📍
              </div>

              <div>
                <strong>
                  Multiple Destinations
                </strong>

                <span>
                  Travel wherever you want
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>


      {/* =================================================
          RIGHT SIDE - LOGIN
      ================================================= */}

      <div style={styles.rightSection}>

        <div style={styles.loginCard}>

          {/* MOBILE LOGO */}

          <div style={styles.mobileLogo}>
            🚌
          </div>


          <div style={styles.heading}>

            <h2>
              Welcome Back!
            </h2>

            <p>
              Sign in to continue your journey
            </p>

          </div>


          {/* ERROR */}

          {error && (

            <div style={styles.error}>

              <span style={styles.errorIcon}>
                !
              </span>

              <span>
                {error}
              </span>

            </div>

          )}


          {/* LOGIN FORM */}

          <form
            onSubmit={handleSubmit}
            style={styles.form}
          >

            {/* EMAIL */}

            <div style={styles.field}>

              <label>
                Email Address
              </label>

              <div style={styles.inputWrapper}>

                <span style={styles.inputIcon}>
                  ✉
                </span>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  required
                  style={styles.input}
                />

              </div>

            </div>


            {/* PASSWORD */}

            <div style={styles.field}>

              <div style={styles.labelRow}>

                <label>
                  Password
                </label>

                <span style={styles.forgot}>
                  Forgot password?
                </span>

              </div>


              <div style={styles.inputWrapper}>

                <span style={styles.inputIcon}>
                  🔒
                </span>

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  required
                  style={styles.input}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  style={styles.eyeButton}
                >
                  {showPassword
                    ? "🙈"
                    : "👁"}
                </button>

              </div>

            </div>


            {/* REMEMBER */}

            <div style={styles.rememberRow}>

              <label style={styles.rememberLabel}>

                <input
                  type="checkbox"
                  style={styles.checkbox}
                />

                <span>
                  Remember me
                </span>

              </label>

            </div>


            {/* LOGIN BUTTON */}

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.button,
                opacity: loading
                  ? 0.7
                  : 1
              }}
            >

              {loading ? (

                <>
                  <span style={styles.spinner}>
                    ⟳
                  </span>

                  Signing in...
                </>

              ) : (

                <>
                  Sign In
                  <span style={styles.arrow}>
                    →
                  </span>
                </>

              )}

            </button>

          </form>


          {/* REGISTER */}

          <div style={styles.registerSection}>

            <span>
              Don't have an account?
            </span>

            <Link
              to="/register"
              style={styles.registerLink}
            >
              Create an account
            </Link>

          </div>


          {/* FOOTER */}

          <div style={styles.footer}>

            <span>
              🚌 BusGo
            </span>

            <span>
              •
            </span>

            <span>
              Safe journeys, happy travels
            </span>

          </div>

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
    display: "flex",
    background:
      "linear-gradient(135deg, #eef4ff 0%, #ffffff 50%, #f5f8ff 100%)",
    fontFamily:
      "Inter, Arial, sans-serif"
  },


  // ===================================================
  // LEFT SECTION
  // ===================================================

  leftSection: {
    width: "50%",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px",
    boxSizing: "border-box",
    background:
      "linear-gradient(145deg, #071952 0%, #0b3b91 55%, #1677ff 100%)",
    position: "relative",
    overflow: "hidden"
  },


  brandContent: {
    maxWidth: "520px",
    position: "relative",
    zIndex: 2
  },


  logoCircle: {
    width: "70px",
    height: "70px",
    borderRadius: "20px",
    background:
      "rgba(255,255,255,0.16)",
    border:
      "1px solid rgba(255,255,255,0.25)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "34px",
    marginBottom: "20px",
    boxShadow:
      "0 15px 35px rgba(0,0,0,0.15)"
  },


  brandTitle: {
    margin: "0 0 45px",
    color: "white",
    fontSize: "34px",
    fontWeight: "800",
    letterSpacing: "-1px"
  },


  brandTitleSpan: {
    color: "#5da9ff"
  },


  heroTitle: {
    color: "white",
    fontSize: "46px",
    lineHeight: "1.12",
    margin: "0 0 22px",
    fontWeight: "800",
    letterSpacing: "-1.5px"
  },


  heroText: {
    color: "rgba(255,255,255,0.78)",
    fontSize: "17px",
    lineHeight: "1.7",
    maxWidth: "450px",
    marginBottom: "40px"
  },


  features: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },


  feature: {
    display: "flex",
    alignItems: "center",
    gap: "15px"
  },


  featureIcon: {
    width: "43px",
    height: "43px",
    borderRadius: "12px",
    background:
      "rgba(255,255,255,0.13)",
    border:
      "1px solid rgba(255,255,255,0.18)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: "18px"
  },


  feature: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    color: "white"
  },


  featureStrong: {
    display: "block"
  },


  // ===================================================
  // RIGHT SECTION
  // ===================================================

  rightSection: {
    width: "50%",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
    boxSizing: "border-box"
  },


  loginCard: {
    width: "100%",
    maxWidth: "470px",
    background: "white",
    borderRadius: "24px",
    padding: "42px",
    boxSizing: "border-box",
    boxShadow:
      "0 25px 70px rgba(25, 55, 110, 0.12)",
    border:
      "1px solid rgba(20, 60, 120, 0.07)"
  },


  mobileLogo: {
    display: "none"
  },


  heading: {
    marginBottom: "30px"
  },


  headingH2: {
    margin: "0 0 8px",
    fontSize: "32px",
    color: "#10244a",
    fontWeight: "800"
  },


  headingP: {
    margin: 0,
    color: "#718096",
    fontSize: "15px"
  },


  // ===================================================
  // ERROR
  // ===================================================

  error: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "13px 15px",
    marginBottom: "20px",
    background: "#fff1f2",
    border:
      "1px solid #fecdd3",
    color: "#be123c",
    borderRadius: "10px",
    fontSize: "14px"
  },


  errorIcon: {
    width: "22px",
    height: "22px",
    borderRadius: "50%",
    background: "#e11d48",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold"
  },


  // ===================================================
  // FORM
  // ===================================================

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "21px"
  },


  field: {
    display: "flex",
    flexDirection: "column",
    gap: "9px"
  },


  labelRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },


  label: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#253858"
  },


  forgot: {
    color: "#1677ff",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer"
  },


  inputWrapper: {
    height: "52px",
    display: "flex",
    alignItems: "center",
    border:
      "1px solid #dce3ee",
    borderRadius: "11px",
    background: "#fbfcfe",
    transition: "all 0.2s ease",
    boxSizing: "border-box"
  },


  inputIcon: {
    width: "45px",
    textAlign: "center",
    color: "#7b8ba5",
    fontSize: "17px"
  },


  input: {
    flex: 1,
    height: "100%",
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: "15px",
    color: "#1a2b49",
    padding: "0 8px"
  },


  eyeButton: {
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: "17px",
    padding: "0 14px"
  },


  // ===================================================
  // REMEMBER
  // ===================================================

  rememberRow: {
    marginTop: "-5px"
  },


  rememberLabel: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    fontSize: "14px",
    color: "#68778e",
    cursor: "pointer"
  },


  checkbox: {
    width: "16px",
    height: "16px",
    accentColor: "#1677ff",
    cursor: "pointer"
  },


  // ===================================================
  // BUTTON
  // ===================================================

  button: {
    height: "54px",
    border: "none",
    borderRadius: "12px",
    background:
      "linear-gradient(135deg, #1167e8, #2487ff)",
    color: "white",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow:
      "0 10px 25px rgba(22,119,255,0.25)",
    transition:
      "transform 0.2s ease, box-shadow 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px"
  },


  arrow: {
    fontSize: "21px",
    lineHeight: 1
  },


  spinner: {
    fontSize: "20px"
  },


  // ===================================================
  // REGISTER
  // ===================================================

  registerSection: {
    marginTop: "28px",
    textAlign: "center",
    fontSize: "14px",
    color: "#718096"
  },


  registerLink: {
    marginLeft: "6px",
    color: "#1677ff",
    textDecoration: "none",
    fontWeight: "700"
  },


  // ===================================================
  // FOOTER
  // ===================================================

  footer: {
    marginTop: "30px",
    paddingTop: "20px",
    borderTop:
      "1px solid #edf0f5",
    display: "flex",
    justifyContent: "center",
    gap: "8px",
    color: "#9aa6b8",
    fontSize: "12px"
  }

};


// =====================================================
// RESPONSIVE STYLES
// =====================================================

const responsiveStyle = document.createElement("style");

responsiveStyle.innerHTML = `

  * {
    box-sizing: border-box;
  }

  button:hover {
    filter: brightness(1.05);
  }

  form button[type="submit"]:hover {
    transform: translateY(-2px);
    box-shadow:
      0 14px 30px rgba(22,119,255,0.32) !important;
  }

  input:focus {
    border-color: #1677ff !important;
  }

  @media (max-width: 900px) {

    body {
      margin: 0;
    }

    div[style*="min-height: 100vh"] {
      min-height: 100vh;
    }

  }

  @media (max-width: 760px) {

    /* Hide desktop branding */

    div[style*="linear-gradient(145deg"] {
      display: none !important;
    }

    /* Login takes full width */

    div[style*="width: 50%"] {
      width: 100% !important;
    }

  }

`;

if (
  typeof document !== "undefined" &&
  !document.getElementById("busgo-login-styles")
) {

  responsiveStyle.id =
    "busgo-login-styles";

  document.head.appendChild(
    responsiveStyle
  );
}


export default Login;