const express = require('express');
const Author = require('../models/author');
const router = express.Router();

// Create Author
router.post('/authors', async (req, res) => {
    try {
        const { name, email, phoneNumber } = req.body;
        const newAuthor = new Author({ name, email, phoneNumber });
        await newAuthor.save();
        res.status(201).json(newAuthor);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update Author
router.put('/authors/:id', async (req, res) => {
    try {
        const { name, email, phoneNumber } = req.body;
        const updatedAuthor = await Author.findByIdAndUpdate(req.params.id, { name, email, phoneNumber }, { new: true });
        res.status(200).json(updatedAuthor);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete Author
router.delete('/authors/:id', async (req, res) => {
    try {
        await Author.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Author deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
