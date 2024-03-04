import { Socket } from "socket.io";
import { RoomManager } from "./RoomManager";
export interface User {
  socket: Socket;
  name: string;
}
export class UserManager {
  private users: User[];
  private queue: string[];
  private roomManager: RoomManager;
  constructor() {
    this.users = [];
    this.queue = [];
    this.roomManager = new RoomManager();
  }
  addUser(name: string, socket: Socket) {
    this.users.push({
      name,
      socket,
    });
    this.queue.push(socket.id);
    socket.send("lobby");
    console.log("in add user");
    this.clearQueue();
    this.initHandlers(socket);
  }
  removeUser(socketId: string) {
    const user = this.users.find((x) => x.socket.id === socketId);
    this.users = this.users.filter((x) => x.socket.id !== socketId);
    this.queue = this.queue.filter((x) => x === socketId);
  }
  clearQueue() {
    if (this.queue.length < 2) {
      return;
    }
    console.log(this.queue.length);
    const u1 = this.queue.pop();
    const u2 = this.queue.pop();
    console.log(u1);
    console.log(u2);
    const user1 = this.users.find((x) => x.socket.id === u1);
    const user2 = this.users.find((x) => x.socket.id === u2);
    console.log("user1: " + user1);
    console.log("user2: " + user2);
    if (!user1 || !user2) {
      return;
    }
    const room = this.roomManager.createRoom(user1, user2);
    this.clearQueue();
  }
  initHandlers(socket: Socket) {
    console.log("in offer");
    socket.on("offer", ({ sdp, roomId }: { sdp: string; roomId: string }) => {
      this.roomManager.onOffer(roomId, sdp, socket.id);
    });
    socket.on("answer", ({ sdp, roomId }: { sdp: string; roomId: string }) => {
      console.log("in offer");
      this.roomManager.onAnswer(roomId, sdp, socket.id);
    });
    socket.on("add-ice-candidate", ({ candidate, roomId, type }) => {
      this.roomManager.onIceCandidates(roomId, socket.id, candidate, type);
    });
    socket.on("send-message", (message, room) => {
      if (room === "") {
        socket.broadcast.emit("receive-message", message);
      } else {
        socket.to(room).emit("receive-message", message);
      }
    });
    socket.on("join-room", (room) => {
      socket.join(room);
    });
  }
}
