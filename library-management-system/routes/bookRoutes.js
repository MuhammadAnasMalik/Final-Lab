const express = require('express');
const Book = require('../models/book');
const Author = require('../models/author');
const router = express.Router();

// Create Book
router.post('/books', async (req, res) => {
    try {
        const { title, author, isbn, availableCopies } = req.body;
        const newBook = new Book({ title, author, isbn, availableCopies });
        await newBook.save();
        res.status(201).json(newBook);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update Book
router.put('/books/:id', async (req, res) => {
    try {
        const { title, author, isbn, availableCopies } = req.body;
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, { title, author, isbn, availableCopies }, { new: true });
        res.status(200).json(updatedBook);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete Book
router.delete('/books/:id', async (req, res) => {
    try {
        await Book.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
