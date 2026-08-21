import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {

  const navigate = useNavigate();

  const {
    register,
    loading
  } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: ""
  });

  const [error, setError] = useState("");


  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (e) => {

    const {
      name,
      value
    } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value
    }));

  };


  // =====================================================
  // HANDLE REGISTER
  // =====================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    const result =
      await register(form);

    if (!result.success) {

      setError(
        result.message ||
        "Registration failed"
      );

      return;
    }

    navigate("/login");

  };


  // =====================================================
  // UI
  // =====================================================

  return (

    <div style={styles.page}>

      {/* =================================================
          BACKGROUND DECORATION
      ================================================= */}

      <div style={styles.backgroundCircleOne}></div>
      <div style={styles.backgroundCircleTwo}></div>


      {/* =================================================
          REGISTER CARD
      ================================================= */}

      <div style={styles.card}>

        {/* BRAND */}

        <div style={styles.brandSection}>

          <div style={styles.logo}>
            🚌
          </div>

          <div>

            <h1 style={styles.brandTitle}>
              Bus Booking
            </h1>

            <p style={styles.brandSubtitle}>
              Your journey starts here
            </p>

          </div>

        </div>


        {/* TITLE */}

        <div style={styles.headingSection}>

          <h2 style={styles.title}>
            Create your account
          </h2>

          <p style={styles.subtitle}>
            Register to search buses and book your seats.
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


        {/* =================================================
            REGISTER FORM
        ================================================= */}

        <form
          onSubmit={handleSubmit}
          style={styles.form}
        >

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
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                required
                autoComplete="name"
                style={styles.input}
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
                ✉
              </span>

              <input
                name="email"
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
                style={styles.input}
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
                name="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={form.phone}
                onChange={handleChange}
                required
                autoComplete="tel"
                style={styles.input}
              />

            </div>

          </div>


          {/* PASSWORD */}

          <div style={styles.field}>

            <label style={styles.label}>
              Password
            </label>

            <div style={styles.inputWrapper}>

              <span style={styles.inputIcon}>
                🔒
              </span>

              <input
                name="password"
                type="password"
                placeholder="Create a password"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
                style={styles.input}
              />

            </div>

            <p style={styles.passwordHint}>
              Use a strong password to keep your account secure.
            </p>

          </div>


          {/* REGISTER BUTTON */}

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              ...(loading
                ? styles.buttonDisabled
                : {})
            }}
          >

            {loading ? (

              <>

                <span style={styles.spinner}>
                  ⟳
                </span>

                Creating account...

              </>

            ) : (

              <>
                Create Account
                <span style={styles.arrow}>
                  →
                </span>
              </>

            )}

          </button>

        </form>


        {/* =================================================
            LOGIN LINK
        ================================================= */}

        <div style={styles.loginSection}>

          <span style={styles.loginText}>
            Already have an account?
          </span>

          <Link
            to="/login"
            style={styles.loginLink}
          >
            Login
          </Link>

        </div>


        {/* FOOTER */}

        <p style={styles.footer}>
          © 2026 Bus Booking. Travel made simple.
        </p>

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
    position: "relative",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px 20px",
    boxSizing: "border-box",
    background:
      "linear-gradient(135deg, #eef6ff 0%, #f8fbff 45%, #eaf3ff 100%)",
    fontFamily:
      "Arial, Helvetica, sans-serif"
  },


  backgroundCircleOne: {
    position: "absolute",
    width: "420px",
    height: "420px",
    borderRadius: "50%",
    background:
      "rgba(25, 118, 210, 0.08)",
    top: "-180px",
    left: "-150px"
  },


  backgroundCircleTwo: {
    position: "absolute",
    width: "350px",
    height: "350px",
    borderRadius: "50%",
    background:
      "rgba(66, 165, 245, 0.08)",
    bottom: "-150px",
    right: "-120px"
  },


  card: {
    position: "relative",
    zIndex: 2,
    width: "100%",
    maxWidth: "460px",
    padding: "38px",
    boxSizing: "border-box",
    background: "rgba(255,255,255,0.97)",
    borderRadius: "22px",
    border:
      "1px solid rgba(255,255,255,0.8)",
    boxShadow:
      "0 20px 55px rgba(25, 70, 110, 0.15)"
  },


  brandSection: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "13px",
    marginBottom: "28px"
  },


  logo: {
    width: "52px",
    height: "52px",
    borderRadius: "15px",
    background:
      "linear-gradient(135deg, #1976d2, #42a5f5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "27px",
    boxShadow:
      "0 8px 20px rgba(25,118,210,0.25)"
  },


  brandTitle: {
    margin: 0,
    fontSize: "23px",
    fontWeight: "800",
    color: "#12304a"
  },


  brandSubtitle: {
    margin: "4px 0 0",
    color: "#78909c",
    fontSize: "13px"
  },


  headingSection: {
    marginBottom: "24px"
  },


  title: {
    margin: 0,
    color: "#172b4d",
    fontSize: "27px",
    fontWeight: "800"
  },


  subtitle: {
    margin:
      "8px 0 0",
    color: "#718096",
    fontSize: "14px",
    lineHeight: "1.6"
  },


  error: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "13px 15px",
    marginBottom: "20px",
    borderRadius: "10px",
    background: "#fff1f2",
    border:
      "1px solid #fecdd3",
    color: "#be123c",
    fontSize: "14px",
    lineHeight: "1.4"
  },


  errorIcon: {
    width: "22px",
    height: "22px",
    flexShrink: 0,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#e11d48",
    color: "#fff",
    fontWeight: "bold"
  },


  form: {
    display: "flex",
    flexDirection: "column",
    gap: "17px"
  },


  field: {
    display: "flex",
    flexDirection: "column",
    gap: "7px"
  },


  label: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#344563"
  },


  inputWrapper: {
    display: "flex",
    alignItems: "center",
    border:
      "1px solid #d9e2ec",
    borderRadius: "11px",
    background: "#fbfdff",
    transition: "all 0.2s ease",
    overflow: "hidden"
  },


  inputIcon: {
    width: "45px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    color: "#1976d2"
  },


  input: {
    flex: 1,
    minWidth: 0,
    padding: "13px 12px 13px 0",
    border: "none",
    outline: "none",
    background: "transparent",
    color: "#172b4d",
    fontSize: "14px",
    boxSizing: "border-box"
  },


  passwordHint: {
    margin: "0",
    color: "#8a9aaa",
    fontSize: "11px"
  },


  button: {
    width: "100%",
    marginTop: "7px",
    padding: "14px 18px",
    border: "none",
    borderRadius: "11px",
    background:
      "linear-gradient(135deg, #1976d2, #1565c0)",
    color: "#fff",
    fontSize: "15px",
    fontWeight: "800",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    boxShadow:
      "0 8px 18px rgba(25,118,210,0.25)"
  },


  buttonDisabled: {
    opacity: 0.65,
    cursor: "not-allowed",
    boxShadow: "none"
  },


  spinner: {
    fontSize: "18px"
  },


  arrow: {
    fontSize: "20px",
    lineHeight: 1
  },


  loginSection: {
    marginTop: "25px",
    paddingTop: "22px",
    borderTop:
      "1px solid #edf1f5",
    textAlign: "center",
    fontSize: "14px"
  },


  loginText: {
    color: "#718096",
    marginRight: "6px"
  },


  loginLink: {
    color: "#1976d2",
    fontWeight: "800",
    textDecoration: "none"
  },


  footer: {
    margin:
      "22px 0 0",
    textAlign: "center",
    color: "#a0aec0",
    fontSize: "11px"
  }

};


export default Register;