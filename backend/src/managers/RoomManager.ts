import { User } from "./UserManager";
let GLOBAL_ROOM_ID = 1;

interface Room{
    user1: User,
    user2: User,
  
}

export class RoomManager{
    private  rooms: Map<string, Room>
    constructor(){
        this.rooms = new Map<string,Room>();
    }
    createRoom(user1: User, user2: User){
        console.log("in Room");
        const roomId = this.generate().toString();
        this.rooms.set(roomId.toString(),{
            user1,
            user2
        });
        //console.log(user1);
        user1.socket.emit("send-offer",{
            roomId
        })
        // user2.socket.emit("answer",{
        //     roomId
        // })
      
    }

    onOffer(roomId: string,sdp: string, senderSocketid: string){
        const room = this.rooms.get(roomId);
        if(!room){
            return;
        }
        const receivingUser = room.user1.socket.id===senderSocketid? room.user2: room.user1;
        // const user2 = this.rooms.get(roomId)?.user2;
        // console.log("in onOffer", user2);
        receivingUser?.socket.emit("offer",{
            sdp,
            roomId
        })
    }
    onAnswer(roomId: string,sdp: string, senderSocketid: string){
        const room = this.rooms.get(roomId);
        if(!room){
            return;
        }
        const receivingUser = room.user2.socket.id===senderSocketid?room.user2:room.user1;
        // const user1 = this.rooms.get(roomId)?.user1;
        receivingUser?.socket.emit("answer",{
            sdp,
            roomId
        })
    }
    onIceCandidates(roomId: string, senderSocketid: string, candidate: any,type: "sender" | "receiver"){
        const room = this.rooms.get(roomId);
        if(!room){
            return;
        }
        const reveivingUser = room.user1.socket.id == senderSocketid? room.user2: room.user1;
        reveivingUser.socket.send("add-ice-candidate",({candidate, type}));
    }
        generate(){
        return GLOBAL_ROOM_ID++;
    }

}