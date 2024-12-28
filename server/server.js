const http = require('http');
const { Server } = require('socket.io');
const express = require('express');
const cors = require('cors');



const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // For production, specify the exact origin
    },
});

// Serve static files (if needed)
app.use(express.static('public')); 

app.use(cors({
  origin: "https://mer-fish.netlify.app/js-practice", // Replace with your Netlify domain
  credentials: true, // If you're using cookies or authentication
}));

const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});



const products = [];



io.on('connection', (socket) => {
    console.log('User Connected');

    socket.emit('launch', { products });

    socket.on('add-product', (product) => {
        products.push(product);
        io.emit('added-product', product);
        console.log(products);
    })

    socket.on('clear', () => {
        products.pop();
        console.log(products);
    })
})
