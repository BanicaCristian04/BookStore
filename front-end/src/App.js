import React, {useState} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Catalog from "./components/Catalog/Catalog";
import Login from "./components/Login/Login";
import Register from "./components/Login/Register/Register";
import BookDetails from './components/BookDetails/BookDetails'; 
import { CartProvider } from "./components/Cart/Cart";
import Checkout from "./components/Checkout/Checkout";
const App = () => {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const addToCart = (book) => {
    setCartItems((prevItems) => [...prevItems, book]);
  };
  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };  
  const logoutUser = () => {
    setUser(null);
  };
  return (
    <CartProvider>
  <Router>
      <Navbar cartItems={cartItems} user={user} logoutUser={logoutUser}/>
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Catalog addToCart={addToCart}/>} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/book/:id" element={<BookDetails addToCart={addToCart}/>} />
          <Route
            path="/checkout"
            element={<Checkout cartItems={cartItems} removeFromCart={removeFromCart} user={user} />}
          />
        </Routes>
      </div>
    </Router>
    </CartProvider>
    
  );
};

export default App;
