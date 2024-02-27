import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
export const Landing = () =>{


    const[name,setName] = useState("");
    const[joined, setJoined] = useState(false);
    const [localVideoTrack,setLocalVideoTrack] = useState<null|MediaStreamTrack>(null);
    const [localAudioTrack,setLocalAudioTrack] = useState<null|MediaStreamTrack>(null);
    
    const videoRef = useRef<HTMLVideoElement>(null);
    const getCam = async () => {
        const stream = await window.navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        })
        const videoTracks = stream.getAudioTracks()[0];
        const audioTracks = stream.getAudioTracks()[0];
        setLocalAudioTrack(audioTracks);
        setLocalVideoTrack(videoTracks);
        if(!videoRef.current){
            return;
        }
        videoRef.current.srcObject = stream;
        videoRef.current.play();

    }

    useEffect(()=>{
        if(videoRef && videoRef.current){
            getCam();
        }
    },[videoRef]);
    return <div>
        <video autoPlay ref={videoRef}></video>
       <input type="text" onChange={(e)=>{
        setName(e.target.value);
       }}>
       </input>
       <Link to={`/room/?name=${name}`}>join</Link>
    </div>
}