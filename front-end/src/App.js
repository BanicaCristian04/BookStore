import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Catalog from "./components/Catalog/Catalog";
import Login from "./components/Login/Login";
import Register from "./components/Login/Register/Register";
import BookDetails from './components/BookDetails/BookDetails'; 
import { CartProvider } from "./components/Cart/Cart";
const App = () => {
  return (
    <CartProvider>
  <Router>
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Catalog />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/book/:id" element={<BookDetails />} />
        </Routes>
      </div>
    </Router>
    </CartProvider>
    
  );
};

export default App;
