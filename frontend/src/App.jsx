import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import BusSearch from "./pages/BusSearch";
import Seats from "./pages/Seats";
import Booking from "./pages/Booking";
import BookingSuccess from "./pages/BookingSuccess";
import BookingHistory from "./pages/BookingHistory";

import { AuthProvider, useAuth } from "./context/AuthContext";

function ProtectedRoute({ children }) {

  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AppRoutes() {

  return (
    <Routes>

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/search"
        element={
          <ProtectedRoute>
            <BusSearch />
          </ProtectedRoute>
        }
      />
      <Route
        path="/seats"
        element={<Seats />}
      />
      <Route
        path="/booking"
        element={<Booking />}
      />
      <Route
        path="/booking-success"
        element={
          <ProtectedRoute>
            <BookingSuccess />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-bookings"
        element={<BookingHistory />}
      />

    </Routes>
  );
}

function App() {

  return (
    <BrowserRouter>

      <AuthProvider>

        <AppRoutes />

      </AuthProvider>

    </BrowserRouter>
  );
}

export default App;