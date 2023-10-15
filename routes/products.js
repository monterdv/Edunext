const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// Create a new product (C)
router.get('/new', isLoggedIn, (req, res) => {
    res.render('products/addProduct'); // Render the addnew-product view
});
router.post('/new', isLoggedIn, async (req, res, next) => {
  const { imagePath, title, description, price } = req.body;
  const users = req.user; // Assuming you have user data in the request

  try {
    const product = new Product({
      imagePath,
      title,
      description,
      price,
      users: users._id // Associate the product with the current user
    });

    await product.save();
    res.redirect('/products/list');
  } catch (error) {
    next(error);
  }
});

// Display a list of products (R)
router.get('/list',isLoggedIn, async (req, res, next) => {
    try {
      const products = await Product.find(); // Fetch products from the database
  
      res.render('products/list', { products }); // Render the HBS template with the products data
    } catch (error) {
      next(error);
    }
  });

//edit
  router.get('/:id/edit', isLoggedIn, async (req, res, next) => {
    const productId = req.params.id;
  
    try {
      const product = await Product.findById(productId);
      if (!product) {
        // Handle the case where the product is not found
        // You can redirect to an error page or the product list
        res.redirect('/products/list');
        return;
      }
  
      res.render('products/editProduct', { product });
    } catch (error) {
      next(error);
    }
  });

  // Update product route
router.post('/:id', isLoggedIn, async (req, res, next) => {
    const { imagePath, title, description, price } = req.body;
    const productId = req.params.id;
  
    try {
      await Product.findByIdAndUpdate(productId, { imagePath, title, description, price });
      res.redirect('/products/list'); // Redirect after updating the product
    } catch (error) {
      next(error);
    }
  });

  // Delete product route
router.post('/:id/delete', isLoggedIn, async (req, res, next) => {
    const productId = req.params.id;
    
  
    try {
      await Product.findByIdAndRemove(productId);
      res.redirect('/products/list'); // Redirect after deleting the product
    } catch (error) {
      next(error);
    }
  });

  module.exports = router;


  function isLoggedIn(req, res, next){
      if(req.isAuthenticated()){
          return next();
      }
      res.redirect('/');
  }