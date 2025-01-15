import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./BookDetails.css";

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const stripHtmlTags = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
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
      <div className="book-details-left">
        <img
          src={
            book.volumeInfo.imageLinks?.thumbnail ||
            "https://via.placeholder.com/150"
          }
          alt={book.volumeInfo.title}
        />
      </div>
      <div className="book-details-right">
        <h1 className="book-details-title">{book.volumeInfo.title}</h1>
        <h3 className="book-details-author">
          By: {book.volumeInfo.authors?.join(", ")}
        </h3>
        <p className="book-details-description">
        {stripHtmlTags(book.volumeInfo.description || "No description available.")}
        </p>
        <ul className="book-details-info">
          <li>Publisher: {book.volumeInfo.publisher || "Unknown"}</li>
          <li>
            Published Date: {book.volumeInfo.publishedDate || "Unknown"}
          </li>
          <li>Page Count: {book.volumeInfo.pageCount || "Unknown"}</li>
          <li>Language: {book.volumeInfo.language || "Unknown"}</li>
        </ul>
        <div className="book-details-purchase">
          <span className="book-details-price">
            {book.saleInfo.listPrice?.amount
              ? `$${book.saleInfo.listPrice.amount}`
              : "Price unavailable"}
          </span>
          <button className="add-to-cart-button">Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
