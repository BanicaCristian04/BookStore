import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

const Register = () => {
  // const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const modalRef = useRef(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    setMessage('');
    setError('');

    if (!email || !password ) {
      setError('All field are required.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/register', { email, password });
      setMessage(response.data.message);
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err.response?.data?.error || 'An unexpected error occurred.');
    }
  };
  const handleGoogleSignup =()=>{
    window.location.href = 'http://localhost:5000/auth/google/signup';
  }
  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      navigate('/'); 
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="login-modal">
      <div className="login-container" ref={modalRef}>
        <h2>Sign Up</h2>
        <form onSubmit={handleRegister}>
        {/* <div className="form-group">
            <input
              type="text"
              placeholder="Username*"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            </div> */}
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
          </div>
          <button type="submit" className="continue-button">
            Sign Up
          </button>
          <div className="signup-link">
          Already have an account?{' '}
          <button className="login-button" onClick={() => navigate('/login')}>
            Log In
          </button>
        </div>
        </form>
        <div className="divider-container">
          <span className="line"></span>
          <span className="divider-text">OR</span>
          <span className="line"></span>
          
        </div>
        <button className="social-login google" onClick={handleGoogleSignup}>
          <span className="google-icon" /> Sign up with Google
        </button>
        
      </div>
    </div>
  );
};

export default Register;
