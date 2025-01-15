import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faSignInAlt, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-menu">
          <Link to="/" className="navbar-link">
            <FontAwesomeIcon icon={faHome} size="lg" />
          </Link>
          <Link to="/login" className="navbar-link">
            <FontAwesomeIcon icon={faSignInAlt} size="lg" />
          </Link>
          <Link to="/cart" className="navbar-link">
            <FontAwesomeIcon icon={faShoppingCart} size="lg" />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
