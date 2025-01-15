import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword]=useState("");
  const [error, setError] = useState("");
  const modalRef = useRef(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password
      });
      navigate('/'); 
    } catch (err) {
      console.error('Login failed:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Login failed.');
    }
  };

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      navigate('/');
    }
  };
  const handleGoogleLogin =()=>{
    window.location.href = "http://localhost:5000/auth/google";
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
    return (
    <div className="login-modal">
      <div className="login-container" ref={modalRef}>
        <h2>Welcome back</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email address*"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password*"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {<p className="error-message">{error}</p>}
          </div>
          
          <button type="submit" className="continue-button">
            Continue
          </button>
        </form>
        <div className="signup-link">
          Don't have an account?{' '}
          <button className="signup-button" onClick={() => navigate('/register')}>
            Sign Up
          </button>
        </div>
        <div className="divider-container">
          <span className="line"></span>
          <span className="divider-text">OR</span>
          <span className="line"></span>
        </div>
        <button className="social-login google" onClick={handleGoogleLogin}>
          <span className="google-icon" /> Continue with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
