const express = require('express');
const cors = require("cors");
const http = require('http');
const socketIO = require('socket.io');
const bodyParser = require("body-parser");
const { log } = require('console');
require('dotenv').config();


const app = express();
const server = http.createServer(app);
const io = socketIO(server)

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


io.on('connection', (socket) => {
    console.log('User connected');

    socket.on('join', (userId) => {
        socket.join(userId);
        console.log(`user ${userId} joined the room`);
    });

    socket.on('message', (data) => {
        const { senderId, receiverId, message } = data;
        console.log(senderId, receiverId, message);
        io.to(receiverId).emit('message', { senderId, message });
    });

    // Video Call

    socket.on("calluser",({userToCall,signalData,from,name})=>{
        io.to(userToCall).emit("calluser",{signal:signalData,from,name})
    });

    socket.on("answercall",(data)=>{
        io.to(data.to).emit("callaccepted",data.signal)
    })

    // Video Call
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
})


app.get('/', (req, res) => {
    res.send('helloworld')
})



server.listen(process.env.PORT || 3000, () => {
    console.log("Server running on port ", process.env.PORT);
});