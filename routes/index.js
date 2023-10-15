var express = require('express');
var router = express.Router();

var Product = require('../models/product');


/* GET home page. */
router.get('/', async function(req, res, next) {
  try {
    const products = await Product.find();
    res.render('shop/index', {
      title: 'Shopping Clothes',
      products: products.map(product => ({
        imagePath: product.imagePath,
        title: product.title,
        description: product.description,
        price: product.price,
      }))
    });
  } catch (error) {
    // Handle the error here
    next(error);
  }

});


module.exports = router;
