const mongoose = require('mongoose');


const ProductSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    ownerID: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    categoryId:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Products', ProductSchema);