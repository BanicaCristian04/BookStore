import React from "react";
import { useCart } from "../Cart/Cart";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

const Checkout = ({user}) => {
  const { cartItems,setCartItems, removeFromCart } = useCart();
  const navigate = useNavigate();

  const total = cartItems.reduce((sum, item) => {
    return sum + (item.saleInfo.listPrice?.amount || 0) * item.quantity;
  }, 0);

  const handleCheckout = async () => {
    try {
      const response = await fetch("http://localhost:5000/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            title: item.volumeInfo.title,
            price: item.saleInfo.listPrice?.amount || 0,
            quantity: item.quantity,
          })),
          total: cartItems.reduce(
            (sum, item) =>
              sum + (item.saleInfo.listPrice?.amount || 0) * item.quantity,
            0
          ),
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to place order.");
      }
      alert("Order placed successfully!");
      setCartItems([]);
      
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("An error occurred while placing your order.");
    }
  };
  return (
    <div className="checkout-page">
      <h1 className="checkout-title">Shopping Cart</h1>
      {cartItems.length > 0 ? (
        <div className="checkout-content">
          <div className="checkout-items">
            {cartItems.map((item, index) => (
              <div key={index} className="checkout-item">
                <img
                  className="checkout-item-image"
                  src={
                    item.volumeInfo.imageLinks?.thumbnail ||
                    "https://via.placeholder.com/150"
                  }
                  alt={item.volumeInfo.title}
                />
                <div className="checkout-item-details">
                  <h3 className="checkout-item-title">
                    {item.volumeInfo.title}
                  </h3>
                  <p className="checkout-item-quantity">
                    Quantity: {item.quantity}
                  </p>
                  <p className="checkout-item-price">
                    {item.saleInfo.listPrice?.amount
                      ? `$${item.saleInfo.listPrice.amount}`
                      : "Price not available"}
                  </p>
                </div>
                <button
                  className="remove-item-button"
                  onClick={() => removeFromCart(index)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="checkout-summary">
            <h2>Order Summary</h2>
            <p>Total Items: {cartItems.length}</p>
            <p>Total: ${total.toFixed(2)}</p>
            <button className="checkout-button" onClick={handleCheckout}>
              Checkout
            </button>
          </div>
        </div>
      ) : (
        <p className="checkout-empty">Your shopping cart is empty</p>
      )}
    </div>
  );
};

export default Checkout;
