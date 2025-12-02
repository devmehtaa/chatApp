const express = require('express')
const http = require('http')
const {Server} = require('socket.io')
const path = require('path');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
    }
});

app.use(express.static(path.join(__dirname, "public")));

let chatHistory = [];

io.on("connection", (socket) => {
    console.log("User Connected");
    socket.emit("history", chatHistory);

    socket.on("message", (text) => {
        console.log(`Message sent: ${text.text}`);
        chatHistory.push(text);
        if(chatHistory.length > 100){
            chatHistory.shift();
        }
        socket.broadcast.emit("message", text);
    });
});

const port = process.env.PORT || 3000;
server.listen(port, () =>{
    console.log("http://localhost:8080/");
});
