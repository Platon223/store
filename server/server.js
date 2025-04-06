const http = require('http');
const { Server } = require('socket.io');
const express = require('express');
const cors = require('cors');
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const { Product, User } = require("./models/Product");


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


app.get('/users', async (req, res) => {
    const allUsers = await User.find();

    res.json(allUsers);
})




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


                          .comment-form {
                            margin-top: 30px;
                        }
                
                        .comment-form textarea {
                            width: 100%;
                            height: 100px;
                            padding: 10px;
                            font-size: 1rem;
                            background-color: #2a2a2a;
                            border: 1px solid #444;
                            color: #fff;
                            border-radius: 8px;
                            resize: none;
                            margin-bottom: 10px;
                        }
                
                        .comment-form button {
                            padding: 12px 20px;
                            font-size: 1rem;
                            background-color: #4caf50;
                            color: white;
                            font-weight: bold;
                            border-radius: 8px;
                            cursor: pointer;
                            transition: background 0.3s;
                            border: none;
                        }
                
                        .comment-form button:hover {
                            background-color: #388e3c;
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

                            .comment-form {
                                text-align: center;
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
                            <a href="https://mer-fish.netlify.app/js-practice.html">Shop</a>
                            <a href="https://store-7.onrender.com/cart">Cart</a>
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
                                src=""
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
                            <button
                              onclick="
                            
                              let cartArr = JSON.parse(localStorage.getItem('cart-body')) || [];
                    
                              const addProduct = {nm: \`${product.nm}\`, price: \`${product.price}\`, q: 1};
                    
                              cartArr.push(addProduct);
                    
                              localStorage.setItem('cart-body', JSON.stringify(cartArr));

                              console.log(JSON.parse(localStorage.getItem('cart-body')));

                              console.log('hello');
                    
                            "
                              
                              class="add-to-cart"
                              >Add to Cart</button
                            >
                          </div>
                        </div>
                    
                        <!-- Comments Section -->
                        <div class="comments-section">
                          <h2 class="comments-title">Customer Reviews</h2>
                          <div id="comms" class="comments-container"></div>

                          <div class="comment-form">
                            <textarea id="userComment" placeholder="Write your comment..."></textarea>
                            <button onclick="addComment();">Submit Comment</button>
                          </div>
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
                            const text = document.getElementById("userComment").value;
                    
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

    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fishing Rods</title>
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

        /* Navbar */
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

        /* Product Grid */
        .product-container {
            max-width: 1200px;
            margin: 40px auto;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            padding: 20px;
        }

        .product-card {
            background-color: #1e1e1e;
            padding: 15px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            text-align: center;
            transition: transform 0.3s;
        }

        .product-card:hover {
            transform: scale(1.05);
        }

        .product-image {
            width: 100%;
            height: 200px;
            object-fit: cover;
            border-radius: 8px;
        }

        .product-title {
            font-size: 1.2rem;
            margin: 10px 0;
        }

        .product-price {
            font-size: 1.1rem;
            color: #4caf50;
            margin-bottom: 10px;
        }

        .product-details {
            display: inline-block;
            padding: 10px 15px;
            font-size: 1rem;
            background-color: #4caf50;
            color: white;
            font-weight: bold;
            border-radius: 8px;
            transition: background 0.3s;
            text-decoration: none;
        }

        .product-details:hover {
            background-color: #388e3c;
        }

        /* Footer */
        footer {
            text-align: center;
            padding: 20px;
            background-color: #1e1e1e;
            margin-top: 50px;
        }

        /* Responsive */
        @media (max-width: 768px) {
            .product-container {
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            }
        }

    </style>
</head>
<body>

    <!-- Navbar -->
    <header>
        <div class="logo"><img style="width: 80px;
        border-radius: 100px;" src="https://i.postimg.cc/q70Px70L/mer-fish-logo-123.png" alt="qr code" /></div>
        <nav class="nav-links">
            <a href="https://mer-fish.netlify.app/js-practice.html">Home</a>
            <a href="https://mer-fish.netlify.app/js-practice.html">Shop</a>
            <a href="https://store-7.onrender.com/cart">Cart</a>
        </nav>
    </header>

    <!-- Product Grid -->
    <div class="product-container">
        <!-- Product 1 -->
        <div class="product-card">
            <img src="" alt="Product 1" class="product-image">
            <h2 class="product-title">Product One</h2>
            <p class="product-price">$29.99</p>
            <a href="product1.html" class="product-details">View Details</a>
        </div>

        <!-- Product 2 -->
        <div class="product-card">
            <img src="" alt="Product 2" class="product-image">
            <h2 class="product-title">Product Two</h2>
            <p class="product-price">$39.99</p>
            <a href="product2.html" class="product-details">View Details</a>
        </div>

        <!-- Product 3 -->
        <div class="product-card">
            <img src="" alt="Product 3" class="product-image">
            <h2 class="product-title">Product Three</h2>
            <p class="product-price">$49.99</p>
            <a href="product3.html" class="product-details">View Details</a>
        </div>

        <!-- Product 4 -->
        <div class="product-card">
            <img src="https://via.placeholder.com/300x200/0000ff" alt="Product 4" class="product-image">
            <h2 class="product-title">Product Four</h2>
            <p class="product-price">$59.99</p>
            <a href="product4.html" class="product-details">View Details</a>
        </div>
    </div>

    <!-- Footer -->
    <footer>
        &copy; 2025 MyStore | All rights reserved.
    </footer>

     <script>
      const prZone = document.querySelector('.product-container');

      const rodProducts = ${JSON.stringify(rodProducts)};

      async function loadPr() {
        rodProducts.forEach(pr => {
          const prEl = document.createElement('div')
          prEl.className = 'product-card';
          prEl.innerHTML = \`<img src="" alt="Product 1" class="product-image">
            <h2 class="product-title">\${pr.nm}</h2>
            <p class="product-price">$\${pr.price}</p>
            <a href="https://store-7.onrender.com/products/\${pr.nm}" class="product-details">View Details</a>\`;
          
          prZone.appendChild(prEl);
        })
      }

      loadPr();
      
      </script>

</body>
</html>
`)
});


app.get('/cart', async (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cart - MyStore</title>
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
            flex-wrap: wrap;
        }

        .logo {
            font-size: 1.5rem;
            font-weight: bold;
            color: #4caf50;
        }

        .navbar {
            display: flex;
            gap: 30px;
            align-items: center;
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

        /* Cart Page */
        .cart-container {
            max-width: 1200px;
            margin: 40px auto;
            padding: 20px;
        }

        .cart-items {
            background-color: #1e1e1e;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
            margin-bottom: 30px;
        }

        .cart-items h2 {
            font-size: 1.8rem;
            margin-bottom: 15px;
        }

        .cart-item {
            display: flex;
            justify-content: space-between;
            padding: 15px;
            border-bottom: 1px solid #333;
        }

        .cart-item:last-child {
            border-bottom: none;
        }

        .cart-item img {
            width: 80px;
            height: 80px;
            object-fit: cover;
            border-radius: 8px;
        }

        .cart-item-details {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            margin-left: 20px;
            width: 60%;
        }

        .cart-item-title {
            font-size: 1.2rem;
            font-weight: bold;
            margin-bottom: 5px;
        }

        .cart-item-price {
            font-size: 1.1rem;
            color: #4caf50;
            font-weight: bold;
        }

        .cart-item-quantity {
            display: flex;
            align-items: center;
        }

        .quantity-input {
            width: 50px;
            padding: 5px;
            text-align: center;
            background-color: #333;
            border: 1px solid #444;
            border-radius: 5px;
            color: white;
        }

        /* Cart Summary */
        .cart-summary {
            background-color: #1e1e1e;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
        }

        .cart-summary h3 {
            font-size: 1.5rem;
            margin-bottom: 20px;
        }

        .summary-item {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #333;
        }

        .summary-item:last-child {
            border-bottom: none;
        }

        .total-price {
            font-size: 1.5rem;
            color: #4caf50;
            font-weight: bold;
        }

        .checkout-btn {
            display: block;
            width: 100%;
            padding: 12px;
            font-size: 1.2rem;
            background-color: #4caf50;
            color: white;
            text-align: center;
            font-weight: bold;
            border-radius: 8px;
            transition: background 0.3s;
            margin-top: 20px;
        }

        .checkout-btn:hover {
            background-color: #388e3c;
        }

        /* Footer */
        footer {
            text-align: center;
            padding: 20px;
            background-color: #1e1e1e;
            margin-top: 50px;
        }

        .social-icons {
            margin-top: 10px;
        }

        .social-icons a {
            margin: 0 10px;
            color: #f5f5f5;
            font-size: 1.5rem;
            text-decoration: none;
            transition: color 0.3s;
        }

        .social-icons a:hover {
            color: #4caf50;
        }

      .btn-delete {
            padding: 6px 10px;
            background-color: #d32f2f;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background 0.3s;
            font-size: 0.9rem;
            width: auto;
        }

        .btn-delete:hover {
            background-color: #b71c1c;
        }


    </style>
</head>
<body>

    <!-- Header -->
    <header>
        <div class="logo">MyStore</div>
        <div class="navbar">
            <nav>
                <ul class="nav-links">
                    <li><a href="#">Home</a></li>
                    <li><a href="https://mer-fish.netlify.app/js-practice.html">Shop</a></li>
                    <li><a href="https://store-7.onrender.com/cart">Cart</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <!-- Cart Page Content -->
    <div class="cart-container">
        <!-- Cart Items -->
        <div class="cart-items">
            <h2>Your Cart</h2>

            
        </div>

        <!-- Cart Summary -->
        <div class="cart-summary">
            <h3>Order Summary</h3>
            <div class="summary-item">
                <span>Taxes</span>
                <span>$5.00</span>
            </div>
            <div class="summary-item">
                <span>Shipping</span>
                <span>$5.00</span>
            </div>
            <div class="summary-item">
                <span>Total</span>
                <span class="total-price">$64.97</span>
            </div>
            <button onclick="toShopHistory();" class="checkout-btn">Proceed to Checkout</button>
        </div>
    </div>

    <!-- Footer -->
    <footer>
        &copy; 2025 MyStore | Follow us:
        <div class="social-icons">
            <a href="#">📘</a>
            <a href="#">🐦</a>
        </div>
    </footer>

    <script src="https://cdn.socket.io/4.7.2/socket.io.min.js"></script>

    <script>

        const socket = io('https://store-7.onrender.com')
    
        let cart = JSON.parse(localStorage.getItem('cart-body'));
        const summary = document.querySelector('.cart-items');
        let totalPrice = 0;
        const totalZone = document.querySelector('.total-price');
        totalZone.innerHTML = \` $\${totalPrice}\`;

        cart.forEach(pr => {
            const el = document.createElement('div');
            el.className = 'cart-item';
            el.innerHTML = \`
                <img src="" alt="Product Image" />
                <div class="cart-item-details">
                    <span class="cart-item-title">\${pr.nm}</span>
                    <span class="cart-item-price">$\${pr.price}</span>
                    <div class="cart-item-quantity">
                    <button onclick="uptadeVal('\${pr.nm}', -1);">-</button>
                    <input type="text" class="quantity-input" value="\${pr.q}" />
                    <button onclick="uptadeVal('\${pr.nm}', 1);">+</button>
                    </div>
                    <button onclick="cart = cart.filter(prod => prod.nm !== '\${pr.nm}');
                                    localStorage.setItem('cart-body', JSON.stringify(cart));" class="btn-delete">Delete</button>
                </div>
               \`;

            let price = pr.q * Number(pr.price);
            totalPrice += price;
            totalZone.innerHTML = \`$\${totalPrice}\`;

            summary.appendChild(el);

           
        });


        function uptadeVal(name, num) {
            const cart = JSON.parse(localStorage.getItem('cart-body'));
        
            const pr = cart.find(val => val.nm === name);
        
            pr.q += num;
        
            if(pr.q < 1) {
                pr.q = 1;
            }
        
            localStorage.setItem('cart-body', JSON.stringify(cart));
        
            location.reload();

}


class Purchases{
    constructor(name, price, img, buydate, daysleftofshipping) {
        this.name = name;
        this.price = price;
        this.img = img;
        this.buydate = buydate;
        this.daysleftofshipping = daysleftofshipping;
    }

    async fetchPurchases() {
        const response = await fetch('https://store-7.onrender.com/users');
        const allUsers = await response.json();

        

        const user = allUsers.find(usr => usr.name === 'Platon');

        const purchase = {nm: this.name, price: this.price, img: this.img, buydate: this.buydate, daysleftofshipping: this.daysleftofshipping};



        user.purchases.push(purchase);

        const uptadedUser = {email: user.email, password: user.password, name: user.name, purchases: user.purchases};


        socket.emit('purchase', uptadedUser);
    }
}




function toShopHistory() {
    const previousShop = JSON.parse(localStorage.getItem('cart-body'));
    const shopHist = JSON.parse(localStorage.getItem('shoppingHist')) || [];


    previousShop.forEach(item => {
        new Purchases(item.nm, item.price, 'test', new Date().getFullYear(), 'TBD').fetchPurchases();

    });

    

    
}

    
    </script>

</body>
</html>
`)
});


app.get('/shop-history', (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Shopping History - MyStore</title>
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
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px;
        min-height: 100vh;
      }

      /* Navbar */
      nav {
        width: 100%;
        background-color: #1e1e1e;
        padding: 15px 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
      }

      .logo {
        color: #4caf50;
        font-size: 1.8rem;
        font-weight: bold;
        text-decoration: none;
      }

      .menu {
        display: flex;
        list-style: none;
      }

      .menu li {
        margin: 0 15px;
      }

      .menu li a {
        text-decoration: none;
        color: #f5f5f5;
        font-size: 1.2rem;
        font-weight: bold;
        padding: 12px 20px;
        border-radius: 8px;
        transition: background 0.3s;
      }

      .menu li a:hover {
        background-color: #4caf50;
      }

      /* Hamburger Icon */
      .hamburger {
        display: none;
        font-size: 2rem;
        cursor: pointer;
        color: #f5f5f5;
      }

      /* Responsive Menu */
      @media (max-width: 768px) {
        .menu {
          display: none;
          flex-direction: column;
          position: absolute;
          top: 60px;
          right: 0;
          background-color: #1e1e1e;
          width: 100%;
          text-align: center;
          padding: 10px 0;
        }

        .menu.active {
          display: flex;
        }

        .menu li {
          margin: 10px 0;
        }

        .hamburger {
          display: block;
        }
      }

      /* Header */
      header {
        text-align: center;
        margin-bottom: 40px;
      }

      header h1 {
        font-size: 2rem;
        color: #4caf50;
      }

      header p {
        font-size: 1rem;
        color: #ccc;
      }

      /* Shopping History List */
      .history-list {
        width: 80%;
        max-width: 1200px;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
        margin-bottom: 40px;
      }

      .history-item {
        background-color: #1e1e1e;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        transition: transform 0.3s;
      }

      .history-item:hover {
        transform: translateY(-10px);
      }

      .history-item img {
        width: 100%;
        height: 200px;
        object-fit: cover;
        border-radius: 10px;
        margin-bottom: 15px;
      }

      .history-item h3 {
        font-size: 1.2rem;
        color: #4caf50;
        margin-bottom: 10px;
      }

      .history-item p {
        font-size: 1rem;
        color: #ccc;
        margin-bottom: 5px;
      }

      .history-item span {
        font-weight: bold;
        color: #fff;
      }

      .history-item .price {
        font-size: 1.2rem;
        color: #4caf50;
        font-weight: bold;
      }

      /* Button Styles */
      .back-btn {
        padding: 12px 20px;
        background-color: #4caf50;
        color: white;
        font-weight: bold;
        border-radius: 8px;
        border: none;
        cursor: pointer;
        transition: background 0.3s;
        text-align: center;
        text-decoration: none;
      }

      .back-btn:hover {
        background-color: #388e3c;
      }
    </style>
  </head>
  <body>
    <!-- Navbar (Fully Responsive) -->
    <nav>
      <a href="#" class="logo">MyStore</a>
      <ul class="menu">
        <li><a href="#">Home</a></li>
        <li><a href="#">Shop</a></li>
        <li><a href="#">Products</a></li>
        <li><a href="#">Shopping History</a></li>
        <li><a href="#">Contact</a></li>
      </ul>
      <div class="hamburger">☰</div>
    </nav>

    <!-- Header Section -->
    <header>
      <h1>Shopping History</h1>
      <p>Here you can view your past orders and details.</p>
    </header>

    <!-- Shopping History List -->
    <div class="history-list">
      <div class="history-item">
        <img
          src="https://via.placeholder.com/400x200"
          alt="Fishing Rod - Pro Series"
        />
        <h3>Fishing Rod - Pro Series</h3>
        <p>Order Date: <span>March 20, 2025</span></p>
        <p>Order ID: <span>#123456</span></p>
        <p class="price">$199.99</p>
      </div>

      <div class="history-item">
        <img
          src="https://via.placeholder.com/400x200"
          alt="Fishing Tackle Box"
        />
        <h3>Fishing Tackle Box</h3>
        <p>Order Date: <span>March 15, 2025</span></p>
        <p>Order ID: <span>#123457</span></p>
        <p class="price">$49.99</p>
      </div>

      <div class="history-item">
        <img src="https://via.placeholder.com/400x200" alt="Fishing Boots" />
        <h3>Fishing Boots</h3>
        <p>Order Date: <span>March 10, 2025</span></p>
        <p>Order ID: <span>#123458</span></p>
        <p class="price">$89.99</p>
      </div>
    </div>

    <!-- Back Button -->
    <a href="#" class="back-btn">Back to Shop</a>

    <script>
      // Hamburger Menu Toggle
      document
        .querySelector(".hamburger")
        .addEventListener("click", function () {
          document.querySelector(".menu").classList.toggle("active");
        });


      const historyList = document.querySelector('.history-list');

      const shoppingHistory = JSON.parse(localStorage.getItem('shoppingHist')) || [];


      shoppingHistory.forEach(item => {
        const el = document.createElement('div');
        el.className = 'history-item';

        el.innerHTML = \`<img
          src=""
          alt=""
        />
        <h3>\${item.nm}</h3>
        <p>Order Date: <span>March 15, 2025</span></p>
        <p>Order ID: <span>#123457</span></p>
        <p class="price">$\${item.price}</p>\`;


        historyList.appendChild(el);
      })
    </script>
  </body>
</html>
`)
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
    console.log('user connected');
    users++;
    socket.emit('users', users);

    socket.on('request-products', () => {
        socket.emit('show-products', products);
    })


    socket.on('logout-user', async (data) => {
        const deletedUser = await User.findOneAndDelete({password: data.password});
    })

    socket.on('purchase', async (data) => {
        const filter = {name: data.name};
        const uptade = {
            $set: {
                email: data.email,
                password: data.password,
                name: data.name,
                purchases: data.purchases
            }
        }

        const result = await User.updateOne(filter, uptade);
    })


    socket.on('createAcc', async (data) => {

        try {
            const newAcc = new User({
                email: data.email,
                password: data.password,
                name: data.name
            });

            await newAcc.save();
        } catch(err) {
            console.log(err);
        }
       
        
    });

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
