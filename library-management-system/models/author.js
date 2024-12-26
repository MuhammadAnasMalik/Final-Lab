const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // email validation regex
    },
    phoneNumber: { 
        type: String, 
        required: true, 
        match: /^[0-9]{10}$/, // assuming phone number has exactly 10 digits
    },
});

// Create the Author model
const Author = mongoose.model('Author', authorSchema);

module.exports = Author;
