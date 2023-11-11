import React from "react";
import "./styles/loginregister.css";
import { Link } from "react-router-dom";

const Register = () => {
  return (
    <div className="container">
      <h2 className="regbox">Register</h2>
      <form action="#">
        <input type="text" placeholder="Username" required />
        <input type="password" placeholder="Password" required />
        <div className="frame">
          <button type="submit" className="custom-btn btn-3">
            <span>register</span>
          </button>
        </div>
        <button>
          <span>
            already registered? <Link to="/login">Press here</Link>
          </span>
        </button>
      </form>
    </div>
  );
};

export default Register;
