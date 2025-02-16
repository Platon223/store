const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    nm: String,
    price: String
});


const Product = mongoose.model("Product", productSchema);
module.exports = Product;


