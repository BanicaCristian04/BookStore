import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {useCart} from "../Cart/Cart"
import "./BookDetails.css";

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [price,setPrice]=useState(null);
  const { addToCart } = useCart(); 
  const stripHtmlTags = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch book details");
        }
        const data = await response.json();
        const savedPrice= localStorage.getItem(id);
        setPrice(savedPrice || "Unavailable");
        setBook(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

  if (loading) {
    return <p>Loading book details...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!book) {
    return <p>No book details available.</p>;
  }

  return (
    <div className="book-details-container">
      <div className="book-image">
        <img
          src={
            book.volumeInfo.imageLinks?.thumbnail ||
            "https://via.placeholder.com/150"
          }
          alt={book.volumeInfo.title}
        />
      </div>
      <div className="book-info">
        <h1>{book.volumeInfo.title}</h1>
        <h3>By: {book.volumeInfo.authors?.join(", ")}</h3>
        <p className="book-description">
          {stripHtmlTags(
            book.volumeInfo.description || "No description available."
          )}
        </p>
        <ul className="book-meta">
          <li>
            <strong>Publisher:</strong> {book.volumeInfo.publisher || "Unknown"}
          </li>
          <li>
            <strong>Published Date:</strong>{" "}
            {book.volumeInfo.publishedDate || "Unknown"}
          </li>
          <li>
            <strong>Page Count:</strong> {book.volumeInfo.pageCount || "Unknown"}
          </li>
          <li>
            <strong>Language:</strong> {book.volumeInfo.language || "Unknown"}
          </li>
        </ul>
        <div className="book-actions">
        <span className="price">
            {price !== "Unavailable" ? `$${price}` : "Price unavailable"}
          </span>
          <button
            className="add-to-cart"
            onClick={() => addToCart(book)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
