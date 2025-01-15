import React, { createContext, useState, useContext } from "react";

// Crearea contextului
const CartContext = createContext();

// Hook personalizat pentru utilizarea contextului
export const useCart = () => {
  return useContext(CartContext);
};

// Provider pentru gestionarea stării globale
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Funcție pentru a adăuga un produs în coș
  const addToCart = (book) => {
    setCartItems((prevItems) => [...prevItems, book]);
  };

  // Funcție pentru a elimina un produs din coș (opțional)
  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
