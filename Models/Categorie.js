const mongoose = require('mongoose');

const CategorieSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Categories', CategorieSchema);