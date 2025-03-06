const http = require('http');
const { Server } = require('socket.io');
const express = require('express');
const cors = require('cors');
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Product = require("./models/Product");


const mongoAPI = "mongodb+srv://root:6424superdataproduct@productdata.4i8et.mongodb.net/productdata?retryWrites=true&w=majority&appName=productData";

mongoose.connect(mongoAPI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.log("something went wrong:", err));



const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // For production, specify the exact origin
    },
});

app.use(cors());

app.get("/products/:name", async (req, res) => {
    const product = await Product.findOne({ nm: req.params.name });

    if(product.nm === null) {
        console.log("The page doesn't exist");
    } else {
        res.send(`<!DOCTYPE html>
                    <html lang="en">
                      <head>
                        <meta charset="UTF-8" />
                        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                        <title>Product Page - MyStore</title>
                        <style>
                          /* General Styles */
                          * {
                            margin: 0;
                            padding: 0;
                            box-sizing: border-box;
                          }
                    
                          body {
                            font-family: Arial, sans-serif;
                            background-color: #121212;
                            color: #f5f5f5;
                          }
                    
                          /* Header */
                          header {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            padding: 20px 40px;
                            background-color: #1e1e1e;
                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                          }
                    
                          .logo {
                            font-size: 1.5rem;
                            font-weight: bold;
                            color: #4caf50;
                          }
                    
                          .nav-links {
                            display: flex;
                            gap: 20px;
                          }
                    
                          .nav-links a {
                            text-decoration: none;
                            color: #f5f5f5;
                            font-size: 1rem;
                            transition: color 0.3s;
                          }
                    
                          .nav-links a:hover {
                            color: #4caf50;
                          }
                    
                          /* Product Page */
                          .product-container {
                            max-width: 1200px;
                            margin: 40px auto;
                            display: flex;
                            gap: 30px;
                            padding: 20px;
                            flex-wrap: wrap;
                          }
                    
                          .product-images {
                            flex: 1;
                            min-width: 300px;
                          }
                    
                          .main-image {
                            width: 100%;
                            height: 400px;
                            object-fit: cover;
                            border-radius: 10px;
                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                          }
                    
                          .image-gallery {
                            display: flex;
                            gap: 10px;
                            margin-top: 10px;
                          }
                    
                          .gallery-image {
                            width: 80px;
                            height: 80px;
                            object-fit: cover;
                            border-radius: 8px;
                            cursor: pointer;
                            transition: transform 0.3s;
                          }
                    
                          .gallery-image:hover {
                            transform: scale(1.1);
                          }
                    
                          /* Product Details */
                          .product-details {
                            flex: 1;
                            min-width: 300px;
                          }
                    
                          .product-title {
                            font-size: 2rem;
                            font-weight: bold;
                          }
                    
                          .product-price {
                            font-size: 1.5rem;
                            color: #4caf50;
                            margin: 15px 0;
                          }
                    
                          .product-description {
                            font-size: 1.1rem;
                            line-height: 1.5;
                            margin-bottom: 20px;
                          }
                    
                          .add-to-cart {
                            display: inline-block;
                            padding: 12px 20px;
                            font-size: 1.2rem;
                            background-color: #4caf50;
                            color: white;
                            font-weight: bold;
                            border-radius: 8px;
                            transition: background 0.3s;
                            cursor: pointer;
                            text-decoration: none;
                          }
                    
                          .add-to-cart:hover {
                            background-color: #388e3c;
                          }
                    
                          /* Comment Section */
                          .comments-section {
                            max-width: 1200px;
                            margin: 40px auto;
                            padding: 20px;
                          }
                    
                          .comments-title {
                            font-size: 1.8rem;
                            margin-bottom: 20px;
                          }
                    
                          .comments-container {
                            display: flex;
                            gap: 15px;
                            overflow-x: auto;
                            padding-bottom: 10px;
                          }
                    
                          .comment-card {
                            flex: 0 0 300px;
                            background-color: #1e1e1e;
                            padding: 15px;
                            border-radius: 10px;
                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                          }
                    
                          .comment-author {
                            font-weight: bold;
                            color: #4caf50;
                            margin-bottom: 5px;
                          }
                    
                          .comment-text {
                            font-size: 1rem;
                            line-height: 1.4;
                          }
                    
                          /* Responsive */
                          @media (max-width: 768px) {
                            .product-container {
                              flex-direction: column;
                              align-items: center;
                              text-align: center;
                            }
                    
                            .image-gallery {
                              justify-content: center;
                            }
                    
                            .comments-container {
                              flex-direction: column;
                              align-items: center;
                            }
                          }
                    
                          /* Footer */
                          footer {
                            text-align: center;
                            padding: 20px;
                            background-color: #1e1e1e;
                            margin-top: 50px;
                          }
                        </style>
                      </head>
                      <body>
                        <!-- Header -->
                        <header>
                          <div class="logo">
                            <img
                              style="width: 80px; border-radius: 100px"
                              src="https://i.postimg.cc/q70Px70L/mer-fish-logo-123.png"
                              alt=""
                            />
                          </div>
                          <nav class="nav-links">
                            <a href="#">Home</a>
                            <a href="#">Shop</a>
                            <a href="#">Cart</a>
                          </nav>
                        </header>
                    
                        <!-- Product Page Content -->
                        <div class="product-container">
                          <!-- Product Images -->
                          <div class="product-images">
                            <img
                              src="https://images.unsplash.com/photo-1549262803-693ee58a796b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8fA%3D%3D"
                              alt="Product Image"
                              class="main-image"
                              id="mainImage"
                            />
                            <div class="image-gallery">
                              <img
                                src="https://images.unsplash.com/photo-1548913344-66177da9425e?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                alt="Gallery Image 1"
                                class="gallery-image"
                                onclick="changeImage(this)"
                              />
                              <img
                                src="https://images.unsplash.com/photo-1548913344-66177da9425e?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                alt="Gallery Image 2"
                                class="gallery-image"
                                onclick="changeImage(this)"
                              />
                              <img
                                src="https://via.placeholder.com/80/00ff00"
                                alt="Gallery Image 3"
                                class="gallery-image"
                                onclick="changeImage(this)"
                              />
                            </div>
                          </div>
                    
                          <!-- Product Details -->
                          <div class="product-details">
                            <h1 class="product-title">${product.nm}</h1>
                            <p class="product-price">$${product.price}</p>
                            <p class="product-description">
                              This is an amazing product that will improve your life! It features
                              high-quality materials, long-lasting durability, and a sleek design.
                            </p>
                            <a
                              onclick="
                            
                              let cartArr = JSON.parse(localStorage.getItem('cart-stuff'));
                    
                              const addProduct = {nm: product.nm};
                    
                              cartArr.push(addProduct);
                    
                              localStorage.setItem('cart-stuff', JSON.stringify(cartArr));
                    
                            "
                              href="#"
                              class="add-to-cart"
                              >Add to Cart</a
                            >
                          </div>
                        </div>
                    
                        <!-- Comments Section -->
                        <div class="comments-section">
                          <h2 class="comments-title">Customer Reviews</h2>
                          <div id="comms" class="comments-container"></div>
                        </div>
                    
                        <!-- Footer -->
                        <footer>&copy; 2025 MyStore | All rights reserved.</footer>
                    
                        <!-- JavaScript for Image Gallery -->
                        <script>
                          function changeImage(img) {
                            document.getElementById("mainImage").src = img.src;
                          }
                        </script>
                    
                        <script src="https://store-4-rc42.onrender.com/socket.io/socket.io.js"></script>
                        <script>
                          const socket = io("https://store-7.onrender.com");
                          let clicks = 0;
                    
                          async function loadComments() {
                            const comZone = document.getElementById("comms");
                    
                            const response = await fetch(
                              "https://store-7.onrender.com/api/products"
                            );
                            const result = await response.json();
                            const pr = result.find((val) => val.nm === \`${product.nm}\`);
                    
                            pr.comments.forEach((comm) => {
                              const comEl = document.createElement("div");
                              comEl.className = "comment-card";
                              comEl.innerHTML = \`<p class="comment-author">Example</p>
                              <p class="comment-text">
                                \${comm.text}
                              </p>\`;
                              comZone.appendChild(comEl);
                            });
                          }
                    
                          loadComments();
                    
                          async function fetchProduct() {
                            const response = await fetch(
                              "https://store-7.onrender.com/api/products"
                            );
                            const result = await response.json();
                            const pr = result.find((val) => val.nm === \`${product.nm}\`);
                    
                            pr.likes++;
                    
                            const newProduct = {
                              nm: pr.nm,
                              price: pr.price,
                              class: pr.class,
                              likes: pr.likes,
                              comments: pr.comments,
                            };
                    
                            socket.emit("uptade-product", newProduct);
                          }
                    
                          async function addComment() {
                            const text = document.getElementById("text").value;
                    
                            const response = await fetch(
                              "https://store-7.onrender.com/api/products"
                            );
                            const result = await response.json();
                            const pr = result.find((val) => val.nm === \`${product.nm}\`);
                    
                            const newComment = { nm: pr.nm, text: text };
                    
                            pr.comments.push(newComment);
                    
                            const newProduct = {
                              nm: pr.nm,
                              price: pr.price,
                              class: pr.class,
                              likes: pr.likes,
                              comments: pr.comments,
                            };
                    
                            socket.emit("uptade-product", newProduct);
                          }
                        </script>
                      </body>
                    </html>
`)
    }});

    








app.get('/search/rods', async (req, res) => {
    const rodProducts = await Product.find({class: 'rods'});

    res.json(rodProducts);
});


 app.get("/api/products", async (req, res) => {
        const products = await Product.find();

        res.json(products);
    });

// Serve static files (if needed)

app.use(express.static("products"))


app.use(cors({
  origin: "https://mer-fish.netlify.app/js-practice", // Replace with your Netlify domain
  credentials: true, // If you're using cookies or authentication
}));

const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});



const products = [];
let usernames = [];
let users = 0;


io.on('connection', (socket) => {
    console.log('User connected');
    users++;
    socket.emit('users', users);

    socket.on('request-products', () => {
        socket.emit('show-products', products);
    })

    socket.on('add-product', async (product) => {
        try {
            const newProduct = new Product({
                nm: product.nm,
                price: product.price,
                class: product.class,
                likes: 0,
            });

            await newProduct.save();

            console.log("saved");
        } catch (error) {
            console.log("error occured while saving the product:", error);
        }
        
});

    socket.on('uptade-product', async (data) => {
    const filter = {nm: data.nm};
    const update = {
        $set: {
            nm: data.nm,
            price: data.price,
            class: data.class,
            likes: data.likes,
            comments: data.comments
        }
       
    }

    const result = await Product.updateOne(filter, update);
})

    

    socket.on('remove-product', async (data) => {

        try{
            const result = await Product.findOneAndDelete({nm: data});

            console.log("deleted succefully");
        } catch (error) {
            console.log(error);
        }

      
        
    })

    


    socket.emit('see-accounts', usernames);


    socket.on('delete-acc', accName => {
        console.log(`The name: ${accName}, is going to be deleted`);
        usernames = usernames.filter(obj => obj.nm !== accName);
        console.log(usernames);
    })

    socket.on('request-accounts', () => {
        socket.emit('launch-accounts', usernames);
    })


    socket.on('send-acc', user => {
        usernames.push(user);
    })

    socket.on('disconnect', () => {
        users -= 1;
    })
})
