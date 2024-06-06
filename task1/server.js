const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userrouter = require('./routes/api');
const path = require('path'); // Import the path module
const cors = require('cors');
const http = require('http'); 
const socketIo = require('socket.io'); 

const connection = require('./mongoose');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', userrouter);


const server = http.createServer(app);
const io = socketIo(server);
// Save users' email and socket ID
const activeUsers = {};

io.on('connection', (socket) => {
  
    socket.on('user-msg', (message) => {
       
        activeUsers[socket.id] = socket.id;
console.log('activeUsers is here', activeUsers);

        console.log('A user connected in Socket', message);
        // console.log(socket.id);
        io.emit('msg', message)
    });
    socket.on('disconnect', () => {
        console.log(`User with socket ID ${socket.id} disconnected`);
         
        delete activeUsers[socket.id];
        io.emit('active-users', Object.values(activeUsers)); // Send updated active user list to all clients
    });
});

// Start the server
server.listen(PORT, async () => {
    try {
       await connection
        console.log("your db is connected");
    } catch (error) {
        console.log(error);
    }
    console.log(`Server is running on port ${PORT}`);
});
