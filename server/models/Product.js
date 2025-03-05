const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    nm: String,
    price: String,
    class: String,
    likes: Number,
    comments: {
        type: [ 
            { nm: String, text: String }
        ],
        required: true
    }
});


const Product = mongoose.model("Product", productSchema);
module.exports = Product;


