"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomManager = void 0;
let GLOBAL_ROOM_ID = 1;
class RoomManager {
    constructor() {
        this.rooms = new Map();
    }
    createRoom(user1, user2) {
        console.log("in Room");
        const roomId = this.generate().toString();
        this.rooms.set(roomId.toString(), {
            user1,
            user2,
        });
        //console.log(user1);
        user1.socket.emit("send-offer", {
            roomId,
        });
        user2.socket.emit("send-offer", {
            roomId,
        });
    }
    onMessage(message, roomId, senderSocketid) {
        const room = this.rooms.get(roomId);
        const receivingUser = (room === null || room === void 0 ? void 0 : room.user1.socket.id) === senderSocketid ? room.user2 : room === null || room === void 0 ? void 0 : room.user1;
        const sendingUser = (room === null || room === void 0 ? void 0 : room.user1.socket.id) === senderSocketid ? room.user1 : room === null || room === void 0 ? void 0 : room.user2;
        const id = receivingUser === null || receivingUser === void 0 ? void 0 : receivingUser.socket.id;
        console.log("receving in on message", receivingUser === null || receivingUser === void 0 ? void 0 : receivingUser.socket.id);
        // console.log("receving in on message", sendingUser?.socket.id);
        receivingUser === null || receivingUser === void 0 ? void 0 : receivingUser.socket.emit("receive-message", { message, roomId, id });
        // if (roomId === "") {
        //   receivingUser?.socket.broadcast.emit(
        //     "receive-message",
        //     message,
        //     roomId,
        //     id
        //   );
        // } else {
        //   //receivingUser?.socket.join(roomId);
        // }
    }
    onOffer(roomId, sdp, senderSocketid) {
        const room = this.rooms.get(roomId);
        if (!room) {
            return;
        }
        const receivingUser = room.user1.socket.id === senderSocketid ? room.user2 : room.user1;
        // const user2 = this.rooms.get(roomId)?.user2;
        // console.log("in onOffer", user2);
        receivingUser === null || receivingUser === void 0 ? void 0 : receivingUser.socket.emit("offer", {
            sdp,
            roomId,
        });
    }
    onAnswer(roomId, sdp, senderSocketid) {
        const room = this.rooms.get(roomId);
        if (!room) {
            return;
        }
        const receivingUser = room.user1.socket.id === senderSocketid ? room.user2 : room.user1;
        // const user1 = this.rooms.get(roomId)?.user1;
        receivingUser === null || receivingUser === void 0 ? void 0 : receivingUser.socket.emit("answer", {
            sdp,
            roomId,
        });
    }
    onIceCandidates(roomId, senderSocketid, candidate, type) {
        const room = this.rooms.get(roomId);
        if (!room) {
            return;
        }
        const reveivingUser = room.user1.socket.id == senderSocketid ? room.user2 : room.user1;
        reveivingUser.socket.emit("add-ice-candidate", { candidate, type });
    }
    generate() {
        return GLOBAL_ROOM_ID++;
    }
}
exports.RoomManager = RoomManager;
