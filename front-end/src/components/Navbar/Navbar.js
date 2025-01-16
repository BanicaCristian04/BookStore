import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faSignInAlt, faShoppingCart, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { useCart } from "../Cart/Cart";
import "./Navbar.css";

const Navbar = ({  user, logoutUser }) => {
  const {cartItems}=useCart();
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <p className="navbar-welcome">
          Welcome, {user ? user.email : "Guest"}!
        </p>
      </div>
      <div className="navbar-container">
        <div className="navbar-menu">
          <Link to="/" className="navbar-link">
            <FontAwesomeIcon icon={faHome} size="lg" />
          </Link>
          {!user ? (
            <Link to="/login" className="navbar-link">
              <FontAwesomeIcon icon={faSignInAlt} size="lg" />
            </Link>
          ) : (
            <button className="navbar-link logout-button" onClick={logoutUser}>
              <FontAwesomeIcon icon={faSignOutAlt} size="lg" /> Logout
            </button>
          )}
          <Link to="/checkout" className="navbar-link cart-link">
            <FontAwesomeIcon icon={faShoppingCart} size="lg" />
            {cartItems.length > 0 && (
              <span className="cart-count">{totalItems}</span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
