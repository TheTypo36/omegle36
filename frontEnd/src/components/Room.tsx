import {useEffect, useState} from 'react';
import { Socket, io } from 'socket.io-client';
import { useSearchParams } from "react-router-dom"

const URL = "http://localhost:3000";
 
export const Room = () =>{
    const [searchParams, setSearchParams] = useSearchParams();
    const name = searchParams.get('name');
    console.log('In room')
    const [socket,setSocket] = useState<null|Socket>(null); 
    useEffect(()=>{
        const socket = io(URL);
        socket.on('send-offer',({roomId})=>{
            alert("send answer please");
        });
        socket.on('offer',({roomId,offer})=>{
            alert("send answer please");
            socket.emit('answer',{
                roomId,
                sdp:""
            });
        });
        socket.on('answer',({roomId, answer})=>{
            alert("connection done");
        })
    },[name]);
    return <div>
        hi, {name}
    </div>
}