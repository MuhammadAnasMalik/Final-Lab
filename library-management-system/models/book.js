const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Author', 
        required: true 
    },
    isbn: { 
        type: String, 
        unique: true, 
        required: true 
    },
    availableCopies: { 
        type: Number, 
        required: true, 
        min: 0 
    }
});

// Create the Book model
const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
