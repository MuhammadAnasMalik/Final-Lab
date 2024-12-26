const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Author = require('./models/author'); // Ensure this is the correct path
const Book = require('./models/book');     // Ensure this is the correct path

const app = express();

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', './views');  // Ensure the path to your views folder is correct

// Middleware for parsing request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/library', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
});

// Route to render the home page (index.ejs)
app.get('/', async (req, res) => {
    try {
        // Fetch authors and books from the database
        const authors = await Author.find();
        const books = await Book.find().populate('author');  // Populating the author details

        // Check if we retrieved authors and books correctly
        if (!authors || !books) {
            console.error("Authors or books not found");
            return res.status(500).send('Authors or books not found');
        }

        // Render the index.ejs page with the authors and books data
        res.render('index', { authors, books });
    } catch (err) {
        console.error('Error fetching authors or books:', err);
        res.status(500).send('Internal Server Error: ' + err.message);
    }
});

// Add more routes for Book, Author, and Borrower as needed
// Example: Route for adding a book
app.post('/add-book', async (req, res) => {
    const { title, author, isbn, availableCopies } = req.body;
    try {
        // Basic validation for required fields
        if (!title || !author || !isbn || !availableCopies) {
            console.error("Missing required fields in add-book");
            return res.status(400).send("Missing required fields");
        }

        const book = new Book({
            title,
            author,
            isbn,
            availableCopies
        });

        await book.save();
        res.redirect('/'); // Redirect to the homepage after adding the book
    } catch (err) {
        console.error('Error adding book:', err);
        res.status(500).send('Internal Server Error: ' + err.message);
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
