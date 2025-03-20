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
    firstName: String,
    lastName: String,
});



const Product = mongoose.model("Product", productSchema);
const User = mongoose.model("User", userSchema);
module.exports = { Product, User };


