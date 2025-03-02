const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    nm: String,
    price: String,
    class: String,
    likes: Number,
});


const Product = mongoose.model("Product", productSchema);
module.exports = Product;


