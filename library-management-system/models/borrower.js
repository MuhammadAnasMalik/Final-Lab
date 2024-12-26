const mongoose = require('mongoose');
const { Schema } = mongoose;

// Borrower Schema
const borrowerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    borrowBooks: [{
        type: Schema.Types.ObjectId,
        ref: 'Book'
    }],
    membershipActive: {
        type: Boolean,
        required: true
    },
    membershipType: {
        type: String,
        enum: ['Standard', 'Premium'],
        required: true
    }
});

// Custom validation for membership borrowing limits
borrowerSchema.pre('save', function(next) {
    const maxBooks = this.membershipType === 'Premium' ? 100 : 5;
    if (this.borrowBooks.length > maxBooks) {
        return next(new Error(`A ${this.membershipType} member can borrow up to ${maxBooks} books.`));
    }
    next();
});

module.exports = mongoose.model('Borrower', borrowerSchema);
