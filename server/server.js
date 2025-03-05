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
                        <title>Document</title>
                      </head>
                      <body>
                        <h1 class="name">${product.nm}</h1>
                        <img src="" alt="" />
                        <p>${product.likes} people liked this page.</p>
                        <button onclick="fetchProduct();">Like</button>
                        <h2>What do you think about this product?</h2>
                        <div id="comms"></div>
                        <input id="text" placeholder="Comment" type="text" />
                        <button onclick="addComment()">Post</button>

                        
                        <script src="https://store-4-rc42.onrender.com/socket.io/socket.io.js"></script>
                        <script>
                          const socket = io('https://store-7.onrender.com');
                          let clicks = 0;
                    
                          async function loadComments() {
                            const comZone = document.getElementById("comms");
                    
                            const response = await fetch(
                              "https://store-7.onrender.com/api/products"
                            );
                            const result = await response.json();
                            const pr = result.find((val) => val.nm === \`${product.nm}\`);
                    
                            pr.comments.forEach((comm) => {
                              const comEl = document.createElement("p");
                              comEl.textContent = comm.text;
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
                    </html>`);
    }


});

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
