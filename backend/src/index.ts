//import express from 'express';
import { Socket, Server } from "socket.io";
import http from "http";
import { UserManager } from "./managers/UserManager";
const { join } = require("node:path");

//const app = express();
const server = http.createServer(http);
const io = new Server(server, {
  cors: {
    origin: "https://omegle36.onrender.com",
  },
});
const userManager = new UserManager();

io.on("connection", (socket: Socket) => {
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
