
import { useState } from "react";
import {
  useNavigate,
  Link
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";


function Login() {

  const navigate =
    useNavigate();

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


    // -------------------------------------------------
    // GO TO HOME
    // -------------------------------------------------

    navigate("/", {
      replace: true
    });
  };


  // ===================================================
  // UI
  // ===================================================

  return (

    <div style={styles.container}>

      <div style={styles.card}>

        <h1>
          Bus Booking
        </h1>

        <h2>
          Login
        </h2>


        {/* ERROR */}

        {error && (

          <p style={styles.error}>
            {error}
          </p>

        )}


        {/* LOGIN FORM */}

        <form
          onSubmit={
            handleSubmit
          }
          style={styles.form}
        >

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            required
            style={styles.input}
          />


          <input
            type="password"
            placeholder="Password"
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
            type="submit"
            disabled={loading}
            style={styles.button}
          >

            {loading
              ? "Logging in..."
              : "Login"}

          </button>

        </form>


        <p>

          Don't have an account?{" "}

          <Link to="/register">
            Register
          </Link>

        </p>

      </div>

    </div>
  );
}


// =====================================================
// STYLES
// =====================================================

const styles = {

  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f6f8"
  },


  card: {
    width: "350px",
    padding: "30px",
    background: "white",
    borderRadius: "10px",
    boxShadow:
      "0 4px 15px rgba(0,0,0,0.1)"
  },


  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },


  input: {
    padding: "12px",
    border:
      "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "15px"
  },


  button: {
    padding: "12px",
    border: "none",
    borderRadius: "6px",
    background: "#1976d2",
    color: "white",
    fontSize: "16px",
    cursor: "pointer"
  },


  error: {
    color: "#d32f2f",
    background: "#ffebee",
    padding: "10px",
    borderRadius: "6px"
  }

};


export default Login;
