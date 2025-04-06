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


const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    name: String,
    purchases: {
        type: [
            {nm: String, price: String, img: String, buydate: String, daysleftofshipping: String}
        ],
        required: true
    }
});



const Product = mongoose.model("Product", productSchema);
const User = mongoose.model("User", userSchema);
module.exports = { Product, User };


