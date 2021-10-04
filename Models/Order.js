const mongoose = require('mongoose');


const OrderSchema = mongoose.Schema({
    buyersID: {
        type: String,
        required: true
    },
    buyersFirstName: {
        type: String,
        required: true
    },
    buyersLastName: {
        type: String,
        required: true
    },
    buyersEmail: {
        type: String,
        required: true
    },
    sellersFirstName: {
        type: String,
        required: true
    },
    sellersLastName: {
        type: String,
        required: true
    },
    sellersEmail: {
        type: String,
        required: true
    },
    deliveryAddress: {
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
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Orders', OrderSchema);