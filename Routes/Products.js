const express = require('express');

const router = express.Router();

const Product = require('../Models/Product');
const Categorie = require('../Models/Categorie');


//get all posts
router.get('/', async (req, res) => {
    label: try{
        const categories = await Categorie.find();
        if (categories === null || categories === [] || categories.length === 0){
            res.status(404).json({message: "No categories found!"});
            break label;
        }
        res.status(200).json(categories);
    }catch(err){
        res.status(404).json({message: err});
    }
});


//add post
router.post('/', async (req, res)=>{
    try{
    const categorie = new Categorie({
        name: req.body.name
    });
    const savedcategorie = await categorie.save();  
    res.status(201).json(savedcategorie)  
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
router.delete('/:categoryId', async (req, res) =>{
    label :try{
        const categorie = await Categorie.findById(req.params.categoryId);
        if (categorie === null){
            res.status(404).json({message: "No category with this ID exists!"});
            break label;
        }
     const removedCategory = await Categorie.deleteOne({_id: req.params.categoryId });
     res.status(204).json({message: "Category deleted"});
    }catch(err){
        res.status(404).json({message: err});
    }
});

//update post
router.put('/:categoryId', async (req, res)=>{
    try{
    const updatedCategory = await Categorie.updateOne({ _id: req.params.categoryId}, {$set: {name: req.body.name}});
    res.status(200).json(updatedCategory);
    }catch(err){
        res.status(404).json({message: err});
    }
})





//------------------------------------------------------------------------------
//get all posts
router.get('/:categoryId/products', async (req, res) => {          /// irgi reikia dvieju tikrinimu, cj reikia parasyti kad jei nera tokio id tai kad no category with this id o jei id yra tai tzada kad nera products
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


//add post
router.post('/:categoryId/products', async (req, res)=>{
    try{
    const product = new Product({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        categoryId: req.params.categoryId
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
router.delete('/:categoryId/products/:productId', async (req, res) =>{
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
     const removedProduct = await Product.deleteOne({_id: req.params.productId });
     res.status(204).json(removedProduct);
    }catch(err){
        res.status(404).json({message: err});
    }
});

//update post
router.put('/:categoryId/products/:productId', async (req, res)=>{
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
    const updatedProduct = await Product.updateOne({ _id: req.params.productId}, {$set: {title: req.body.title}});
    res.status(200).json(updatedProduct);
    }catch(err){
        res.status(404).json({message: err});
    }
})
module.exports = router;