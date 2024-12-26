const mongoose = require('mongoose');

const borrowerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    borrowedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
    membershipActive: { type: Boolean, required: true },
    membershipType: { 
        type: String, 
        enum: ['Standard', 'Premium'], 
        required: true 
    },
});

borrowerSchema.methods.validateBorrowLimit = function () {
    const limit = this.membershipType === 'Premium' ? 100 : 5;
    if (this.borrowedBooks.length > limit) {
        throw new Error(`Borrowing limit exceeded for ${this.membershipType} membership.`);
    }
};

module.exports = mongoose.model('Borrower', borrowerSchema);
