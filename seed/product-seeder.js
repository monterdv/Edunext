var Product = require('../models/product');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/project_dev');

var products = [
    new Product({
        imagePath: 'https://png.pngtree.com/png-clipart/20210123/ourmid/pngtree-red-black-jacket-clipart-png-image_2775667.jpg',
        title: 'Ao Thun 1',
        description: 'Ao cho nam va nu',
        price: 100,
    }),
    new Product({
        imagePath: 'https://png.pngtree.com/png-clipart/20201223/ourmid/pngtree-clothing-sweater-clothes-clothing-mens-clothing-spring-clothes-foreign-trade-tailor-png-image_2611494.jpg',
        title: 'Ao Thun 2',
        description: 'Ao cho nam va nu',
        price: 100,
    }),
    new Product({
        imagePath: 'https://png.pngtree.com/png-clipart/20210113/ourmid/pngtree-sleeve-jacket-clip-art-png-image_2728000.png',
        title: 'Ao Thun 3',
        description: 'Ao cho nam va nu',
        price: 100,
    }),
    new Product({
        imagePath: 'https://png.pngtree.com/png-clipart/20210113/ourmid/pngtree-jacket-clip-art-winter-png-image_2728001.png',
        title: 'Ao Thun 4',
        description: 'Ao cho nam va nu',
        price: 100,
    }),
];

Promise.all(products.map(product => product.save()))
    .then(() => {
        exit();
    })
    .catch(err => {
        console.error('Error saving products:', err);
        exit();
    });

function exit() {
    mongoose.disconnect();
}