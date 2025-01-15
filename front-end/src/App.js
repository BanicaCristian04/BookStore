import React, {useEffect} from "react";
import {useState} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Login from "./components/Login/Login";
import Register from "./components/Login/Register/Register";

const App = () => {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<h1>Welcome to site</h1>} />
        <Route
          path="/login"
          element={
            <>
              <h1>Welcome to site</h1>
              <Login />
            </>
          }
        />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
};

export default App;