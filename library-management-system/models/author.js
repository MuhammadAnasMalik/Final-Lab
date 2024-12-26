const mongoose = require('mongoose');
const Joi = require('joi');

const authorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true, match: /\S+@\S+\.\S+/ },
    phoneNumber: { type: String, required: true, match: /^[0-9]{10}$/ },
    linkedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
});

authorSchema.methods.validateBookLimit = function () {
    if (this.linkedBooks.length > 5) {
        throw new Error('An author cannot be linked to more than 5 books.');
    }
};

module.exports = mongoose.model('Author', authorSchema);
