"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserManager = void 0;
const RoomManager_1 = require("./RoomManager");
class UserManager {
    constructor() {
        this.users = [];
        this.queue = [];
        this.roomManager = new RoomManager_1.RoomManager();
    }
    addUser(name, socket) {
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
    removeUser(socketId) {
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
    initHandlers(socket) {
        console.log("afteruser");
        socket.on("offer", ({ sdp, roomId }) => {
            this.roomManager.onOffer(roomId, sdp, socket.id);
        });
        socket.on("answer", ({ sdp, roomId }) => {
            console.log("in offer");
            this.roomManager.onAnswer(roomId, sdp, socket.id);
        });
        socket.on("add-ice-candidate", ({ candidate, roomId, type }) => {
            this.roomManager.onIceCandidates(roomId, socket.id, candidate, type);
        });
        socket.on("send-message", ({ message, roomId }) => {
            console.log("recieving roomid in server", roomId, message, socket.id);
            this.roomManager.onMessage(message, roomId, socket.id);
        });
    }
}
exports.UserManager = UserManager;
