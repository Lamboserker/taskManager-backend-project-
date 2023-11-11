import React, { useState } from "react";
import axios from "axios";
import "./styles/loginregister.css";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
     
      const response = await axios.post(
        "http://localhost:3001/api/users/login",
        { email, password }
      );

      // You can set the token received on successful login in local storage or context api
      localStorage.setItem("token", response.data.token);

      // Redirect user to home page or dashboard after successful login
      // This is just a placeholder, replace with your actual logic
      window.location = "/home";
    } catch (error) {
      // Handle errors here, such as invalid credentials
      setError("Invalid credentials");
    }
  };

  return (
    <div className="body">
      <div className="formsbody">
        <h2 className="h2">Login</h2>
        <form className="form" onSubmit={handleSubmit}>
          {error && <div style={{ color: "red" }}>{error}</div>}
          <div>
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              className="input"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="password">
              Password
            </label>
            <input
              className="input"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button onClick={handleSubmit} className="btn-12" type="submit">
            Login
          </button>
        </form>
        <Link to="/register">Register</Link>
      </div>
    </div>
  );
};

export default Login;
