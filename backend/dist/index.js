"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//import express from 'express';
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const UserManager_1 = require("./managers/UserManager");
const { join } = require("node:path");
//const app = express();
const server = http_1.default.createServer(http_1.default);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
    },
});
const userManager = new UserManager_1.UserManager();
io.on("connection", (socket) => {
    console.log("a user connected");
    //   socket.on("send-message", ({ message, socket1 }) => {
    //     console.log("MESSAGE", message);
    //     socket.to(socket1.id).emit("receive-message", message);
    //   });
    userManager.addUser("anvi", socket);
    socket.on("disconnect", () => {
        userManager.removeUser(socket.id);
    });
});
server.listen(3000, () => {
    console.log("server running at http://localhost:3000");
});
