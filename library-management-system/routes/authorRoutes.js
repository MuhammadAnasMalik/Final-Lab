const express = require('express');
const Author = require('../models/author');
const Book = require('../models/book');
const router = express.Router();

// Create Author
router.post('/', async (req, res) => {
    try {
        const author = new Author(req.body);
        await author.save();
        res.status(201).send(author);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// Update Author
router.put('/:id', async (req, res) => {
    try {
        const author = await Author.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).send(author);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// Delete Author
router.delete('/:id', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);

        // Ensure no books are linked before deletion
        const linkedBooks = await Book.find({ author: author._id });
        if (linkedBooks.length > 0) {
            return res.status(400).send('Cannot delete author linked to books.');
        }

        await Author.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// Get Authors Linked to More Than 5 Books
router.get('/overlimit', async (req, res) => {
    try {
        const authors = await Author.find({}).populate('linkedBooks');
        const overLimitAuthors = authors.filter((author) => author.linkedBooks.length > 5);
        res.status(200).send(overLimitAuthors);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

module.exports = router;
