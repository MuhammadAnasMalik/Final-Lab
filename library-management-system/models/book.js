const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author', required: true },
    isbn: { type: String, unique: true, required: true },
    availableCopies: { type: Number, required: true, min: 0 },
    borrowFrequency: { type: Number, default: 0 },
});

bookSchema.pre('save', function (next) {
    if (this.borrowFrequency > 10 && this.availableCopies > 100) {
        this.availableCopies = 100;
    }
    next();
});

module.exports = mongoose.model('Book', bookSchema);
