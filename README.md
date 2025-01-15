# BookStore Application

## Purpose of the Website

BookStore is a web application designed for book enthusiasts. Users can browse through a catalog of books organized by categories, view detailed information about each book, and add them to their shopping cart. The application provides a seamless and intuitive online shopping experience.

### Key Features:
- **Catalog**: Browse books from various categories, each displaying the title, author, image, and price.
- **Category Filtering**: Users can filter books by specific categories.
- **Pagination**: The catalog is split into pages for easier navigation.
- **Book Details**: Access detailed information about each book, including a description and price.
- **Shopping Cart**: Add books to the cart for future reference and purchase.

---

## Installation and Setup Instructions

# 1. Prerequisites
- **Node.js**: Ensure you have [Node.js](https://nodejs.org/) installed.
- **Git**: Ensure you have [Git](https://git-scm.com/) installed.

# 2. Clone the Repository
Clone the repository to your local machine using the following command:
bash
git clone https://github.com/username/BookStore.git

Navigate to the project directory:
cd BookStore

# 3. Install Dependencies
Install the dependencies for both the backend and frontend:
### Backend
cd back-end
npm install

### Frontend
cd ../front-end
npm install
# 4. Set Environment Variables

Create a .env file in the back-end directory and add the following variables:
PORT=5000
GOOGLE_BOOKS_API_KEY=YourGoogleBooksAPIKey

# 5. Start the Application

Start the backend server:
    cd back-end
    npm start

Start the frontend server:
    cd ../front-end
    npm start
The application will be available at: http://localhost:3000.

