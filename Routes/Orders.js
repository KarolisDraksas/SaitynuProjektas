const express = require('express');

const router = express.Router();

const Order = require('../Models/Order');

//get all posts
router.get('/:userId', async (req, res) => {
    try{
        const orders = await Order.find({ buyersID: req.params.userId});
        res.status(201).json(orders);
    }catch(err){
        res.json({message: err});
    }
});


//add order ---------------------- needs changing in new order creation cause all req.body is from post schema
router.post('/', async (req, res)=>{
    const order = new Order({
        buyersID: "61576e7557db2483b263c144",
        buyersFirstName: req.body.buyersFirstName,
        buyersLastName: req.body.buyersFirstName,
        buyersEmail: req.body.buyersFirstName,
        sellersFirstName: req.body.buyersFirstName,
        sellersLastName: req.body.buyersFirstName,
        sellersEmail: req.body.buyersFirstName,
        deliveryAddress: req.body.deliveryAddress,
        description: req.body.description,
        price: req.body.price
    });
    try{
    const savedOrders = await order.save();  
    res.status(200).json(savedOrders)  
    } catch(err){
        res.json({ message: err });
    }
    
});




module.exports = router;