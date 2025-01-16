import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../Cart/Cart";
import "./Catalog.css";

const Catalog = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("fiction");
  const [page, setPage] = useState(0);
  const { addToCart } = useCart(); 
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, [query, page]);

  const fetchBooks = async () => {
    setLoading(true);
    setError(null);

    try {
      const startIndex = page * 20;
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=subject:${query}&startIndex=${startIndex}&maxResults=20&key=AIzaSyDv9-0cQDXqoIUWf1NO1jLTT8vHEwIFT5k`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error.message || "Failed to fetch data.");
      }

      const data = await response.json();
      const updatedBooks = data.items.map((book) => {
        if (!book.saleInfo.listPrice) {
          const savedPrice = localStorage.getItem(book.id);
          if (!savedPrice) {
            const randomPrice = (Math.random() * (100 - 10) + 10).toFixed(2);
            localStorage.setItem(book.id, randomPrice);
            book.saleInfo = { listPrice: { amount: randomPrice } };
          } else {
            book.saleInfo = { listPrice: { amount: savedPrice } };
          }
        }
        return book;
      });
      setBooks(updatedBooks);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (newQuery) => {
    setQuery(newQuery);
    setPage(0);
  };
  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    if (page > 0) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  const handleBookClick = (book) => {
    navigate(`/book/${book.id}`);
  };

  return (
    <div className="catalog-container">
      <div className="sidebar">
        <h3>Categories</h3>
        <ul>
          <li onClick={() => handleCategoryChange("fiction")}>Fiction</li>
          <li onClick={() => handleCategoryChange("romance")}>Romance</li>
          <li onClick={() => handleCategoryChange("mystery")}>Mystery</li>
          <li onClick={() => handleCategoryChange("fantasy")}>Fantasy</li>
          <li onClick={() => handleCategoryChange("science")}>Science</li>
          <li onClick={() => handleCategoryChange("biography")}>Biography</li>
          <li onClick={() => handleCategoryChange("history")}>History</li>
          <li onClick={() => handleCategoryChange("philosophy")}>Philosophy</li>
          <li onClick={() => handleCategoryChange("technology")}>Technology</li>
          <li onClick={() => handleCategoryChange("art")}>Art</li>
        </ul>
      </div>
      <div className="grid">
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {!loading &&
          books.map((book) => (
            <div className="card" key={book.id}>
              <img
                src={
                  book.volumeInfo.imageLinks?.thumbnail ||
                  "https://via.placeholder.com/150"
                }
                alt={book.volumeInfo.title}
                onClick={() => handleBookClick(book)}
              />
              <h4>{book.volumeInfo.title}</h4>
              <p>{book.volumeInfo.authors?.join(", ")}</p>
              <p>
                {book.saleInfo.listPrice?.amount
                  ? `$${book.saleInfo.listPrice.amount}`
                  : "Price not available"}
              </p>
              <button onClick={() => addToCart(book)}>Add to cart</button>
            </div>
            
          ))}
          <div className="pagination">
        <button onClick={handlePreviousPage} disabled={page === 0}>
          &#8592; Previous
        </button>
        <span>Page {page + 1}</span>
        <button onClick={handleNextPage}>Next &#8594;</button>
      </div>
          
      </div>
      
    </div>
  );
};

export default Catalog;
