const http = require('http');
const { Server } = require('socket.io');
const express = require('express');
const cors = require('cors');
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");


const mongoAPI = "mongodb+srv://platontikhnenko:m6jK3NujPuFh_E4@cluster0.4i8et.mongodb.net/Cluster0?retryWrites=true&w=majority&appName=Cluster0";

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



let products = [];
let usernames = [];
let users = 0;


io.on('connection', (socket) => {
    console.log('User Connected');
    users++;
    socket.emit('users', users);

    socket.emit('launch', { products });

    socket.on('request-products', () => {
        socket.emit('show-products', products);
    })

    socket.on('add-product', (product) => {
        products.push(product);
        io.emit('added-product', product);


        const htmlContent = `
            <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>${product.nm}</title>
                </head>
                <body>
                    <h1>Welcome!</h1>
                    <p>This is an HTML file created asynchronously.</p>
                </body>
            </html>`;
        
        const filePath = path.join(__dirname, "products", `${product.nm}.html`);
        
        // Write the file asynchronously
        fs.writeFile(filePath, htmlContent, (err) => {
            if (err) {
                console.error("Error writing file:", err);
            } else {
                console.log("HTML file created successfully:", filePath);
            }
});

    })

    socket.on('remove-product', data => {
        products = products.filter(obj => obj.nm !== data);
    })

    socket.on('clear', () => {
        products.pop();
        console.log(products);
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
