const express = require('express');

const router = express.Router();

const Product = require('../Models/Product');

//get all posts
router.get('/', async (req, res) => {
    try{
        const products = await Product.find();
        if (products !== null){
        res.status(200).json(products);
        } else{
            res.status(404).json({message: "No products found!"});
        }
    }catch(err){
        res.status(404).json({message: err});
    }
});


//add post
router.post('/', async (req, res)=>{
    try{
    const product = new Product({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price
    });
    const savedProduct = await product.save();  
    res.status(201).json(savedProduct)  
    } catch(err){
        res.status(404).json({ message: err });
    }
    
});

// get specific product
router.get('/:productId', async (req, res)=>{
    try{
    const product = await Product.findById(req.params.productId);
    if (product !== null){
        res.status(200).json(product);
    } else{
        res.status(404).json({message: "No product with this ID found!"});
    }

    }catch(err){
        res.status(404).json({message: err});
    }
})


// delete specific post
router.delete('/:productId', async (req, res) =>{
    try{
     const removedProduct = await Product.deleteOne({_id: req.params.productId });
     res.status(204).json(removedProduct);
    }catch(err){
        res.status(404).json({message: err});
    }
});

//update post
router.patch('/:productId', async (req, res)=>{
    try{
    const updatedProduct = await Product.updateOne({ _id: req.params.productId}, {$set: {title: req.body.title}});
    res.status(200).json(updatedProduct);
    }catch(err){
        res.status(404).json({message: err});
    }
})
module.exports = router;