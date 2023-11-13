import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import axios from "axios";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";


const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Prüfen Sie beim Starten der App, ob ein Token im LocalStorage gespeichert ist
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          // Stellen Sie sicher, dass Sie einen Endpunkt in Ihrem Backend haben, der die Token-Validierung durchführt
          await axios.get("http://localhost:3001/api/users/validate-token", {
            headers: { "x-auth-token": token },
          });
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Token validation failed", error);
          localStorage.removeItem("token");
          setIsAuthenticated(false);
        }
      }
    };

    checkAuthStatus();
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate replace to="/home" />
              ) : (
                <Login setAuthStatus={setIsAuthenticated} />
              )
            }
          />
          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />
          <Route
            path="/home"
            element={isAuthenticated ? <Home /> : <Navigate replace to="/" />}
          />
          {/* Weitere Routen hier einfügen */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
