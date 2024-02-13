"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const express = require('express');
const { join } = require('node:path');
const app = express();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
io.on('connection', (socket) => {
    console.log('a user connected');
});
server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});
