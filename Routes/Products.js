const express = require('express');

const router = express.Router();

const Product = require('../Models/Product');
const Categorie = require('../Models/Categorie');


const auth = require("../Middleware/auth");
const User = require('../Models/User');
//get all posts 
router.get('/', async (req, res) => {
    label: try{
       // console.log(req.user)
        if (true){
        const categories = await Categorie.find();
        if (categories === null || categories === [] || categories.length === 0){
            res.status(404).json({message: "No categories found!"});
            break label;
        }
        res.status(200).json(categories);}
    }catch(err){
        res.status(404).json({message: err});
    }
});


//add post
router.post('/', auth, async (req, res)=>{
    try{

    if (req.user.role ==='admin'){
    const categorie = new Categorie({
        name: req.body.name
    });
    const savedcategorie = await categorie.save();  
    res.status(201).json(savedcategorie)} 
    else{
        res.status(403).json({message: "You need to be admin to add categories"})
    }
    } catch(err){
        res.status(404).json({ message: err });
    }
    
});

// get specific product
router.get('/:categoryId', async (req, res)=>{
    label: try{
    const categorie = await Categorie.findById(req.params.categoryId);
    if (categorie === null){
        res.status(404).json({message: "No category with this ID exists!"});
        break label;
    }
    res.status(200).json(categorie);
    }catch(err){
        res.status(404).json({message: err});
    }
})

// delete specific post
router.delete('/:categoryId', auth, async (req, res) =>{
    label :try{
        if (req.user.role ==='admin'){
        const categorie = await Categorie.findById(req.params.categoryId);
        if (categorie === null){
            res.status(404).json({message: "No category with this ID exists!"});
            break label;
        }
     const removedCategory = await Categorie.deleteOne({_id: req.params.categoryId });
     res.status(204).json({message: "Category deleted"});
    } else{
        res.status(403).json({message: "You need to be admin to delete categories"})
    }
    }catch(err){
        res.status(404).json({message: err});
    }
});

//update post
router.put('/:categoryId', auth, async (req, res)=>{
    try{
        if (req.user.role ==='admin'){
    const updatedCategory = await Categorie.updateOne({ _id: req.params.categoryId}, {$set: {name: req.body.name}});
    res.status(200).json({message: "Category updated"});
        } else{
            res.status(403).json({message: "You need to be admin to update categories"})
        }
    }catch(err){
        res.status(404).json({message: err});
    }
})





//------------------------------------------------------------------------------
//get all posts
router.get('/:categoryId/products', async (req, res) => {          
    label: try{
        const products = await Product.find({categoryId: req.params.categoryId});
        const category = await Categorie.findById(req.params.categoryId);
        if (category === null || category === [] || category.length === 0){
                res.status(404).json({message: "No category exists with this ID"});
                break label;
            }
        if (products === null || products === [] || products.length === 0){
            res.status(404).json({message: "No products found!"});
        }
        res.status(200).json(products);

    }catch(err){
        res.status(404).json({message: err});
    }
});

//-------
//add post
router.post('/:categoryId/products', auth, async (req, res)=>{
    label: try{
        const category = await Categorie.findById(req.params.categoryId);
        if (category === null || category === [] || category.length === 0){
                res.status(404).json({message: "No category exists with this ID"});
                break label;
            }
    const product = new Product({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        categoryId: req.params.categoryId,
        ownerID: req.user.user_id
    });
    const savedProduct = await product.save();  
    res.status(201).json(savedProduct)  
    } catch(err){
        res.status(404).json({ message: err });
    }
    
});

// get specific product
router.get('/:categoryId/products/:productId', async (req, res)=>{
    label: try{
        const category = await Categorie.findById(req.params.categoryId);
        if (category === null || category === [] || category.length === 0){
                res.status(404).json({message: "No category exists with this ID"});
                break label;
            }
    const product = await Product.findById(req.params.productId);
    if (product === null){
        res.status(404).json({message: "No product with this ID found!"});
    }
    res.status(200).json(product);
    }catch(err){
        res.status(404).json({message: err});
    }
})


// delete specific post
router.delete('/:categoryId/products/:productId', auth, async (req, res) =>{
    label: try{
        const category = await Categorie.findById(req.params.categoryId);
        if (category === null || category === [] || category.length === 0){
                res.status(404).json({message: "No category exists with this ID"});
                break label;
            }
            const product = await Product.findById(req.params.productId);
        if (product === null || product === [] || product.length === 0){
            res.status(404).json({message: "No product exists with this ID"});
            break label;
        }
        if (product.ownerID === req.user.user_id || req.user.role === 'admin'){
     const removedProduct = await Product.deleteOne({_id: req.params.productId });
     res.status(204).json(removedProduct);
        } else{
            res.status(403).json({message: "Only product owner can delete his products"});
        }
    }catch(err){
        res.status(404).json({message: err});
    }
});

//update post
router.put('/:categoryId/products/:productId', auth, async (req, res)=>{
    label :try{
        const category = await Categorie.findById(req.params.categoryId);
        if (category === null || category === [] || category.length === 0){
                res.status(404).json({message: "No category exists with this ID"});
                break label;
            }
        const product = await Product.findById(req.params.productId);
        if (product === null || product === [] || product.length === 0){
            res.status(404).json({message: "No product exists with this ID"});
            break label;
        }
        if (product.ownerID === req.user.user_id || req.user.role === 'admin'){

    const updatedProduct = await Product.updateOne({ _id: req.params.productId}, {$set: {title: req.body.title, description: req.body.description,
        price: req.body.price}});
        res.status(200).json({Message: "Product updated"});
        } else{
            res.status(403).json({message: "Only product owner can update his products"});
        }
    }catch(err){
        res.status(404).json({message: err});
    }
})
module.exports = router;