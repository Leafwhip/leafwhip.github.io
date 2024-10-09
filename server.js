const express = require('express');
const app = express();

const http = require('http');
const {Server} = require('socket.io');
const server = http.createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.use(express.static(__dirname + '/public'));

io.on('connection', (socket) => {
    
});

server.listen(3000, () => {
    console.log('connected');
});