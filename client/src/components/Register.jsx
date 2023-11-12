import React, { useState } from "react";
import axios from "axios";
import "./styles/loginregister.css";
import { Link, useNavigate } from "react-router-dom";
import { TwitterPicker } from "react-color";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [color, setColor] = useState("#fff"); // Standardfarbe
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    
    event.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3001/api/users/register",
        {
          name: username,
          email,
          color,
          password,
        }
      );
      window.alert("registration successful!");
      navigate("/login");

      // Hier könnten Sie beispielsweise den Benutzer nach erfolgreicher Registrierung zur Login-Seite umleiten.
    } catch (error) {
      // Überprüfen Sie den Fehlercode und reagieren Sie entsprechend
      if (error.response && error.response.status === 409) {
        setError("User already exists!");
      } else {
        // Allgemeine Fehlermeldung für andere Arten von Fehlern
        setError("registration failed!");
      }
    }
  };

  return (
    <div className="body">
      <div className="container">
        <h2 className="h2">Register</h2>
        <form className="form" onSubmit={handleSubmit}>
          {error && <div style={{ color: "red" }}>{error}</div>}
          <input
            className="input"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            className="input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className="input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <TwitterPicker
            color={color}
            onChangeComplete={(newColor) => setColor(newColor.hex)}
          />

          <div className="frame">
            <button type="submit" className="custom-btn btn-3">
              <span>register</span>
            </button>
          </div>
          <span className="span">
            already registered? <Link to="/login">Press here</Link>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Register;
