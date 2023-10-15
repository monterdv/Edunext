var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var schema = new Schema ({
    imagePath: { type: String, require:true },
    title: { type: String, require:true },
    description: { type: String, require:true },
    price: { type: Number, require:true },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Reference to the User model to associate products with users
    }
});

module.exports = mongoose.model('Product',schema);