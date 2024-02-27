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
    const [sendingPc,setSendingPc] = useState<null|RTCPeerConnection>(null);
    const [receivingPc,setReceivingPc] = useState<null|RTCPeerConnection>(null);
    const [remoteVideoTrack,setRemoteVideoTrack] = useState<null|MediaStreamTrack>(null);
    const [remoteAudioTrack,setRemoteAudioTrack] = useState<null|MediaStreamTrack>(null);
    useEffect(()=>{
        const socket = io(URL);
        socket.on('send-offer',async ({roomId})=>{
            setLobby(false);
            const pc = new RTCPeerConnection();
            setSendingPc(pc);
            const sdp = await pc.createOffer();
            alert("send OFFER please");
            socket.emit('offer',{
                sdp: sdp,
                roomId
            });
        });
        socket.on("offer",async ({roomId,offer})=>{
            alert("Send answer please");
            setLobby(false);
            const pc = new RTCPeerConnection();
            pc.setRemoteDescription({sdp: offer, type: "offer"});
            const sdp = await pc.createAnswer();
            setReceivingPc(pc);
            pc.ontrack = (({track,type})=>{
                if(type=='audio'){
                    setRemoteAudioTrack(track);
                }else{
                    setRemoteVideoTrack(track);
                }
            })
            socket.emit("answer",{
                roomId,
                sdp: sdp
            });
        });
        socket.on("answer",({roomId, answer})=>{
            setLobby(false);
            setSendingPc(pc =>{
                pc?.setRemoteDescription({
                    type: 'answer',
                    sdp: answer
                })
                return pc;
            })

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