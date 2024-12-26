const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const bookRoutes = require('./routes/bookRoutes');
const authorRoutes = require('./routes/authorRoutes');
const borrowerRoutes = require('./routes/borrowerRoutes');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// MongoDB Connection
const mongoURI = 'mongodb://localhost:27017/';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Could not connect to MongoDB:', err));

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Root Page: Render Navigation Buttons
app.get('/', (req, res) => {
    res.render('index', {
        title: 'Library Management System',
    });
});

// Book Page
app.get('/books', (req, res) => {
    res.render('books', { title: 'Manage Books' });
});

// Author Page
app.get('/authors', (req, res) => {
    res.render('authors', { title: 'Manage Authors' });
});

// Borrower Page
app.get('/borrowers', (req, res) => {
    res.render('borrowers', { title: 'Manage Borrowers' });
});

// API Routes
app.use('/api/books', bookRoutes);       // API routes for Books
app.use('/api/authors', authorRoutes);   // API routes for Authors
app.use('/api/borrowers', borrowerRoutes); // API routes for Borrowers

// Start the Server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
