import {useEffect, useState} from 'react';
import { Socket, io } from 'socket.io-client';
import { useSearchParams } from "react-router-dom"

const URL = "http://localhost:3000";
 
export const Room = () =>{
    const [searchParams, setSearchParams] = useSearchParams();
    const name = searchParams.get('name');
    console.log('In room')
    const [socket,setSocket] = useState<null|Socket>(null); 
    const [lobby,setLobby] = useState(true);
    useEffect(()=>{
        const socket = io(URL);
        socket.on('send-offer',({roomId})=>{
            setLobby(false);
            alert("send OFFER please");
            socket.emit('offer',{
                sdp:"",
                roomId
            });
        });
        socket.on("offer",({roomId,offer})=>{
            alert("Send answer please");
            setLobby(false);
            socket.emit("answer",{
                roomId,
                sdp:""
            });
        });
        socket.on("answer",({roomId, answer})=>{
            setLobby(false);

            alert("connection done");
        })
        socket.on("lobby",()=>{
            setLobby(true);
        })
        setSocket(socket);
    },[name]);
    if(lobby){
        return <div>
            waiting to connect you to someone.....
        </div>
    }
    return <div>
        hi, {name}
        <video width={400} height={400} />
        <video width={400} height={400} />
    </div>
}