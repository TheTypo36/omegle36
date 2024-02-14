import { User } from "./UserManager";
let GLOBAL_ROOM_ID = 1;

interface Room{
    user1: User,
    user2: User,
    roomId: string;
}

export class RoomManager{
    private  rooms: Map<string, Room>
    constructor(){
        this.rooms = new Map<string,Room>();
    }
    createRoom(user1Id: string, user2Id: string, roomId: number){
        roomId = this.generate();
    }
    generate(){
        return GLOBAL_ROOM_ID++;
    }

}