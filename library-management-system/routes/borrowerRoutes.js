const express = require('express');
const Borrower = require('../models/borrower');
const Book = require('../models/book');
const router = express.Router();

// Create Borrower
router.post('/borrowers', async (req, res) => {
    try {
        const { name, membershipActive, membershipType } = req.body;
        const newBorrower = new Borrower({ name, membershipActive, membershipType });
        await newBorrower.save();
        res.status(201).json(newBorrower);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Borrow Book
router.post('/borrowers/:id/borrow', async (req, res) => {
    try {
        const { bookId } = req.body;
        const borrower = await Borrower.findById(req.params.id);
        const book = await Book.findById(bookId);

        if (book.availableCopies === 0) {
            return res.status(400).json({ error: 'No available copies for this book.' });
        }

        if (borrower.borrowBooks.length >= (borrower.membershipType === 'Premium' ? 100 : 5)) {
            return res.status(400).json({ error: 'Borrowing limit exceeded for this member.' });
        }

        borrower.borrowBooks.push(book);
        book.availableCopies -= 1;
        await borrower.save();
        await book.save();

        res.status(200).json({ message: 'Book borrowed successfully.' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Return Book
router.post('/borrowers/:id/return', async (req, res) => {
    try {
        const { bookId } = req.body;
        const borrower = await Borrower.findById(req.params.id);
        const book = await Book.findById(bookId);

        const index = borrower.borrowBooks.indexOf(bookId);
        if (index === -1) {
            return res.status(400).json({ error: 'This book was not borrowed by this member.' });
        }

        borrower.borrowBooks.splice(index, 1);
        book.availableCopies += 1;
        await borrower.save();
        await book.save();

        res.status(200).json({ message: 'Book returned successfully.' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
