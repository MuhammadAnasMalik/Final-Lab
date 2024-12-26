const express = require('express');
const Borrower = require('../models/borrower');
const Book = require('../models/book');
const router = express.Router();

// Create Borrower
router.post('/', async (req, res) => {
    try {
        const borrower = new Borrower(req.body);
        await borrower.save();
        res.status(201).send(borrower);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// Update Borrower
router.put('/:id', async (req, res) => {
    try {
        const borrower = await Borrower.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).send(borrower);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// Borrow a Book
router.post('/:id/borrow', async (req, res) => {
    try {
        const borrower = await Borrower.findById(req.params.id);
        if (!borrower.membershipActive) {
            return res.status(400).send('Cannot borrow books with inactive membership.');
        }

        const book = await Book.findById(req.body.bookId);
        if (book.availableCopies <= 0) {
            return res.status(400).send('No available copies of the book.');
        }

        const borrowLimit = borrower.membershipType === 'Premium' ? 100 : 5;
        if (borrower.borrowedBooks.length >= borrowLimit) {
            return res.status(400).send('Borrowing limit exceeded.');
        }

        // Update Book and Borrower Data
        book.availableCopies -= 1;
        borrower.borrowedBooks.push(book._id);

        await book.save();
        await borrower.save();

        res.status(200).send({ borrower, book });
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// Return a Book
router.post('/:id/return', async (req, res) => {
    try {
        const borrower = await Borrower.findById(req.params.id);
        const book = await Book.findById(req.body.bookId);

        // Ensure the borrower has borrowed the book
        const bookIndex = borrower.borrowedBooks.indexOf(book._id);
        if (bookIndex === -1) {
            return res.status(400).send('This book was not borrowed by the borrower.');
        }

        // Update Book and Borrower Data
        book.availableCopies += 1;
        borrower.borrowedBooks.splice(bookIndex, 1);

        await book.save();
        await borrower.save();

        res.status(200).send({ borrower, book });
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// Prevent Borrowing if Borrower Has Overdue Books
router.get('/:id/overdue', async (req, res) => {
    try {
        const borrower = await Borrower.findById(req.params.id).populate('borrowedBooks');
        
        // Simulated check for overdue books
        const overdueBooks = borrower.borrowedBooks.filter((book) => {
            // Logic to check for overdue (e.g., using timestamps)
            return false; // Replace with actual overdue logic
        });

        if (overdueBooks.length > 0) {
            return res.status(400).send('Cannot borrow books with overdue items.');
        }

        res.status(200).send('No overdue books.');
    } catch (err) {
        res.status(400).send(err.message);
    }
});

module.exports = router;
