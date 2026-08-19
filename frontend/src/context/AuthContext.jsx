
import {
  createContext,
  useContext,
  useState
} from "react";

import api from "../services/api";


// =====================================================
// CREATE AUTH CONTEXT
// =====================================================

const AuthContext = createContext();


// =====================================================
// AUTH PROVIDER
// =====================================================

export const AuthProvider = ({ children }) => {

  // ---------------------------------------------------
  // LOAD USER FROM LOCAL STORAGE
  // ---------------------------------------------------

  const [user, setUser] = useState(() => {

    try {

      const savedUser =
        localStorage.getItem("user");

      if (!savedUser) {
        return null;
      }

      return JSON.parse(savedUser);

    } catch (error) {

      console.error(
        "LOAD USER ERROR:",
        error
      );

      localStorage.removeItem("user");

      return null;
    }
  });


  // ---------------------------------------------------
  // LOADING
  // ---------------------------------------------------

  const [loading, setLoading] =
    useState(false);


  // ===================================================
  // LOGIN
  // ===================================================

  const login = async (
    email,
    password
  ) => {

    setLoading(true);

    try {

      console.log(
        "LOGIN REQUEST:",
        email
      );


      // ------------------------------------------------
      // CALL LOGIN API
      // ------------------------------------------------

      const response =
        await api.post(
          "/auth/login",
          {
            email,
            password
          }
        );


      console.log(
        "LOGIN RESPONSE:",
        response.data
      );


      // ------------------------------------------------
      // GET TOKEN
      // ------------------------------------------------

      const token =
        response.data?.token;


      // ------------------------------------------------
      // GET USER
      // ------------------------------------------------

      const loggedInUser =
        response.data?.user;


      // ------------------------------------------------
      // CHECK TOKEN
      // ------------------------------------------------

      if (!token) {

        return {
          success: false,
          message:
            "Login successful but token was not received"
        };
      }


      // ------------------------------------------------
      // SAVE TOKEN
      // ------------------------------------------------

      localStorage.setItem(
        "token",
        token
      );


      // ------------------------------------------------
      // SAVE USER
      // ------------------------------------------------

      if (loggedInUser) {

        localStorage.setItem(
          "user",
          JSON.stringify(
            loggedInUser
          )
        );

        setUser(loggedInUser);

      } else {

        console.warn(
          "Login response does not contain user"
        );

        localStorage.removeItem(
          "user"
        );

        setUser(null);
      }


      // ------------------------------------------------
      // RETURN SUCCESS
      // ------------------------------------------------

      return {
        success: true,
        user: loggedInUser
      };


    } catch (error) {

      console.error(
        "LOGIN ERROR:",
        error.response?.data ||
        error.message
      );


      return {
        success: false,

        message:
          error.response?.data?.message ||
          "Login failed"
      };


    } finally {

      setLoading(false);

    }
  };


  // ===================================================
  // REGISTER
  // ===================================================

  const register = async (
    userData
  ) => {

    setLoading(true);

    try {

      const response =
        await api.post(
          "/auth/register",
          userData
        );


      console.log(
        "REGISTER RESPONSE:",
        response.data
      );


      return {
        success: true,
        data: response.data
      };


    } catch (error) {

      console.error(
        "REGISTER ERROR:",
        error.response?.data ||
        error.message
      );


      return {
        success: false,

        message:
          error.response?.data?.message ||
          "Registration failed"
      };


    } finally {

      setLoading(false);

    }
  };


  // ===================================================
  // LOGOUT
  // ===================================================

  const logout = () => {

    console.log(
      "LOGGING OUT"
    );


    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );


    setUser(null);
  };


  // ===================================================
  // AUTH CONTEXT
  // ===================================================

  return (

    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout
      }}
    >

      {children}

    </AuthContext.Provider>
  );
};


// =====================================================
// USE AUTH
// =====================================================

export const useAuth = () => {

  return useContext(
    AuthContext
  );
};
