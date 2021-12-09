const express = require('express');
const bcrypt = require('bcryptjs');

const router = express.Router();
const jwt = require('jsonwebtoken')


const User = require('../Models/User');
const Order = require('../Models/Order');
const SALT_WORK_FACTOR = 10;
const Product = require('../Models/Product');

const auth = require('../Middleware/auth')

router.get('/', async (req, res) => {
    label: try{
        const users = await User.find({role:"user"});
        if (users === null){
            res.status(404).json({message: "No users found!"});
            break label;
        }
        //res.status(200).json(users);
        res.send(users);

    }catch(err){
        res.status(404).json({message: err});
    }
});


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
    label: try{
    const user = await User.findById(req.params.userId);
    if (user === null){   
        res.status(404).json({message: "No user with this ID found!"});
        break label;
    }
    res.status(200).json(user);
    }catch(err){
        res.status(404).json({message: err});
    }
})


// delete specific post
router.delete('/:userId', auth, async (req, res) =>{
    label: try{
        if (req.user.role === 'admin' || req.user.user_id === req.params.userId){
     const user = await User.findById(req.params.userId);
     if (user === null){
        res.status(404).json({message: "No user with this ID"});
        break label;
     }
     const removedUser = await User.deleteOne({_id: req.params.userId });
     res.status(204).json({message: "User deleted"});
    } else {
        res.status(403).json({message: "This user can't delete other users"});
        break label;
    }
    }catch(err){
        res.status(404).json({message: err});
    }
});

//update post
router.put('/:userId', auth, async (req, res)=>{
    label: try{
     if (req.user.role === 'admin' || req.user.user_id === req.params.userId){
        if (!(req.body.last_name && req.body.first_name && req.body.email && req.body.password)){
            res.status(404).json({message: "All user fields are required"})
            break label;
        }
        const user = await User.findById(req.params.userId);
        if (user === null){
        res.status(404).json({message: "No user with this ID"});
        break label;
        }
        const pass = await bcrypt.hash(req.body.password, 10);
        const updatedUser = await User.updateOne({ _id:req.params.userId}, {$set: {first_name: req.body.first_name, 
        last_name: req.body.last_name, email: req.body.email,password: pass}});
        /*jwt.destroy()
        const token = jwt.sign(
            { user_id: updatedUser._id, email: updatedUser.email, role: updatedUser.role },
            process.env.TOKEN_KEY,
            {
              expiresIn: "2h",
              algorithm: 'HS256'
            }
          );
    
          updatedUser.token = token */
        res.status(200).json({message: "User updated"});
    } else{
        res.status(403).json({message: "This user cannot update"});
        break label;
    }
    }catch(err){
        res.status(404).json({message: err});
    }
})


//get all users orders
router.get('/:userId/orders', auth, async (req, res) => {
    label: try{
        if (req.user.role === 'admin' || req.user.user_id === req.params.userId){
        const user = await User.findById(req.params.userId);
        if (user === null){
            res.status(404).json({message: "No user with this ID"});
            break label;
        }
        const orders = await Order.find({ buyersID: req.params.userId});
        if (orders === null || orders === [] || orders.length === 0){
            res.status(404).json({message: "No orders of this user exists"});
            break label;
        }
        res.status(200).json(orders);
    } else{
        res.status(403).json({message: "User can only access his own orders"});
        break label;
    }
    }catch(err){
        res.status(404).json({message: err});
    }
});


//add order ---------------------- 
router.post('/:userId/orders', auth, async (req, res) => {
    label: try{
        if (req.user.role === 'admin' || req.user.user_id === req.params.userId){
    //const product = await Product.findById({_id: req.body.productID});
    //console.log(product)
       // if (product._id === req.body.productID){
        if (req.body.buyersID === req.params.userId){
    const order = new Order({
        buyersID: req.body.buyersID,
        buyersFirstName: req.body.buyersFirstName,
        buyersLastName: req.body.buyersFirstName,
        buyersEmail: req.body.buyersFirstName,
        deliveryAddress: req.body.deliveryAddress,
        productID: req.body.productID
    });
    const savedOrders = await order.save();  
    res.status(201).json(savedOrders)  } else{
        res.status(404).json({message: "User ID don't match"})
        break label;
    }
    } /*else{
        res.status(404).json({message: "No product with this ID"})
        break label;
    }*/
     else{
        res.status(403).json({message: "User can only make his own orders"});
        break label;
    }
    } catch(err){
        res.status(404).json({ message: err });
    }
    
});

router.get('/:userId/orders/:orderId', auth, async (req, res)=>{
    label: try{
        //if (req.user.role === 'admin' || req.user.user_id === req.params.userId){
    const user = await User.findById(req.params.userId);
    const orders = await Order.find({ buyersID: req.params.userId, _id: req.params.orderId});

    if (user === null || user === [] || user.length === 0){
        res.status(404).json({message: "There is no user with this ID"});
        break label;
    }        
    if (req.user.role === 'admin' || req.user.user_id === req.params.userId){
    if (orders === null || orders === [] || orders.length === 0){
        res.status(404).json({message: "There is no order with this ID"});
        break label;
    }
    res.status(200).json(orders);
    } else{
        res.status(403).json({message: "User can only get his own order"});
        break label;
    }
    }catch(err){
        res.status(404).json({message: err});
    }
})

router.delete('/:userId/orders/:orderId', auth, async (req, res) =>{
    label: try{
       // if (req.user.role === 'admin' || req.user.user_id === req.params.userId){
        const user = await User.findById(req.params.userId);
        const orders = await Order.find({ buyersID: req.params.userId, _id: req.params.orderId});
    
        if (user === null || user === [] || user.length === 0){
            res.status(404).json({message: "There is no user with this ID"});
            break label;
        }        
        if (req.user.role === 'admin' || req.user.user_id === req.params.userId){
        if (orders === null || orders === [] || orders.length === 0){
            res.status(404).json({message: "There is no order with this ID"});
            break label;
        }
     const removedOrder = await Order.deleteOne({_id: req.params.orderId, buyersID: req.params.userId });
     res.status(204).json(removedOrder);
    } else{
        res.status(403).json({message: "User can only delete his own order"});
        break label;
    }
    }catch(err){
        res.status(404).json({message: err});
    }
});


router.put('/:userId/orders/:orderId', auth, async (req, res)=>{
   label: try{
        const user = await User.findById(req.params.userId);
        const orders = await Order.find({ buyersID: req.params.userId, _id: req.params.orderId});
    
        if (user === null || user === [] || user.length === 0){
            res.status(404).json({message: "There is no user with this ID"});
            break label;
        }        
        if (req.user.role === 'admin' || req.user.user_id === req.params.userId){
        if (orders === null || orders === [] || orders.length === 0){
            res.status(404).json({message: "There is no order with this ID"});
            break label;
        }
    const updatedOrder = await Order.updateOne({ _id:req.params.orderId, buyersID:req.params.userId}, {$set: {buyersFirstName: req.body.buyersFirstName,
    buyersLastName: req.body.buyersLastName, buyersEmail: req.body.buyersEmail, deliveryAddress: req.body.deliveryAddress}});
    res.status(200).json({Message: "Order updated"});
        } else{
            res.status(403).json({message: "User can only update his own order"});
        break label;
        }
    }catch(err){
        res.status(404).json({message: err});
    }
})


module.exports = router;