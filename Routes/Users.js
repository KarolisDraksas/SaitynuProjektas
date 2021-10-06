const express = require('express');
const bcrypt = require('bcryptjs');

const router = express.Router();

const User = require('../Models/User');
const Order = require('../Models/Order');
const SALT_WORK_FACTOR = 10;


//get all posts
router.get('/', async (req, res) => {
    try{
        const users = await User.find();
        if (users !== null){
        res.status(200).json(users);
        } else{
            res.status(404).json({message: "No users found!"});
        }
    }catch(err){
        res.status(404).json({message: err});
    }
});


//add post
router.post('/', async (req, res)=>{
    try{
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    const pass = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: pass
    });
    const savedUser = await user.save();  
    res.status(201).json(savedUser)  
    } catch(err){
        res.status(404).json({ message: err });
    }
    
});

router.get('/:userId', async (req, res)=>{
    try{
    const user = await User.findById(req.params.userId);
    if (user !== null){
    res.status(200).json(user);
    } else{
        res.status(404).json({message: "No user with this ID found!"});
    }
    }catch(err){
        res.status(404).json({message: err});
    }
})


// delete specific post
router.delete('/:usertId', async (req, res) =>{
    try{
     const removedUser = await User.deleteOne({_id: req.params.usertId });
     res.status(204).json(removedUser);
    }catch(err){
        res.status(404).json({message: err});
    }
});

//update post
router.patch('/:userId', async (req, res)=>{
    try{
    const updatedUser = await User.updateOne({ _id:req.params.userId}, {$set: {firstName: req.body.firstName}});
    res.status(200).json(updatedUser);
    }catch(err){
        res.status(404).json({message: err});
    }
})


//get all users orders
router.get('/:userId/orders', async (req, res) => {
    try{
        const orders = await Order.find({ buyersID: req.params.userId});
        if (orders !== null && orders !== [] && orders.length > 0){
        res.status(200).json(orders);
        } else{
            res.status(404).json({message: "No orders of this user found!"});
        }
    }catch(err){
        res.status(404).json({message: err});
    }
});


//add order ---------------------- needs changing in new order creation cause all req.body is from post schema
router.post('/:userId/orders', async (req, res) => {
    try{
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
    const savedOrders = await order.save();  
    res.status(201).json(savedOrders)  
    } catch(err){
        res.status(404).json({ message: err });
    }
    
});

router.get('/:userId/orders/:orderId', async (req, res)=>{
    try{
    //const user = await User.findById(req.params.userId);
    const orders = await Order.find({ buyersID: req.params.userId, _id: req.params.orderId});
    if (orders !== null && orders !== [] && orders.length > 0){
        res.status(200).json(orders);
    } else{
        res.status(404).json({message: "No orders with this ID found!"});
    }
    }catch(err){
        res.status(404).json({message: err});
    }
})

router.delete('/:usertId/orders/:orderId', async (req, res) =>{
    try{
     const removedOrder = await Order.deleteOne({_id: req.params.orderId, buyersID: req.params.usertId });
     res.status(204).json(removedOrder);
    }catch(err){
        res.status(404).json({message: err});
    }
});


router.patch('/:userId/orders/:orderId', async (req, res)=>{
    try{
    const updatedOrder = await Order.updateOne({ _id:req.params.orderId, buyersID:req.params.userId}, {$set: {buyersFirstName: req.body.buyersFirstName}});
    res.status(200).json(updatedOrder);
    }catch(err){
        res.status(404).json({message: err});
    }
})


module.exports = router;