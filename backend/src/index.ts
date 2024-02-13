const express = require('express');
import {Socket,Server} from 'socket.io';
import http from 'http';
const {join} = require('node:path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

io.on('connection',(socket: Socket)=>{
    console.log('a user connected');

});

server.listen(3000, ()=>{

    console.log('server running at http://localhost:3000');
})