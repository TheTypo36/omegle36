import styled from "styled-components";
import { useEffect, useRef, useState } from "react";

import { Socket, io } from "socket.io-client";

const URL = "https://omegle36.onrender.com";

export const Room = ({
  name,
  localAudioTrack,
  localVideoTrack,
}: {
  name: string;
  localAudioTrack: MediaStreamTrack | null;
  localVideoTrack: MediaStreamTrack | null;
}) => {
  const [lobby, setLobby] = useState(true);
  const [socket, setSocket] = useState<null | Socket>(null);
  const [sendingPc, setSendingPc] = useState<null | RTCPeerConnection>(null);
  const [receivingPc, setReceivingPc] = useState<null | RTCPeerConnection>(
    null
  );
  const [remoteVideoTrack, setRemoteVideoTrack] =
    useState<MediaStreamTrack | null>(null);
  const [remoteAudioTrack, setRemoteAudioTrack] =
    useState<MediaStreamTrack | null>(null);
  const [remoteMediaStream, setRemoteMediaStream] =
    useState<MediaStream | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>();
  const localVideoRef = useRef<HTMLVideoElement>();
  const [message, setMessage] = useState("");
  const [roomId, setRoomId] = useState("");
  useEffect(() => {
    const socket = io(URL);
    socket.on("send-offer", async ({ roomId }) => {
      console.log("sending offer");
      setLobby(false);
      const pc = new RTCPeerConnection();

      setSendingPc(pc);
      if (localVideoTrack) {
        console.error("added tack");
        console.log(localVideoTrack);
        pc.addTrack(localVideoTrack);
      }
      if (localAudioTrack) {
        console.error("added tack");
        console.log(localAudioTrack);
        pc.addTrack(localAudioTrack);
      }

      pc.onicecandidate = async (e) => {
        console.log("receiving ice candidate locally");
        if (e.candidate) {
          socket.emit("add-ice-candidate", {
            candidate: e.candidate,
            type: "sender",
            roomId,
          });
        }
      };

      pc.onnegotiationneeded = async () => {
        console.log("on negotiation neeeded, sending offer");
        const sdp = await pc.createOffer();
        //@ts-ignore
        pc.setLocalDescription(sdp);
        socket.emit("offer", {
          sdp,
          roomId,
        });
      };
    });

    socket.on("offer", async ({ roomId, sdp: remoteSdp }) => {
      console.log("received offer");
      setLobby(false);
      const pc = new RTCPeerConnection();
      pc.setRemoteDescription(remoteSdp);
      const sdp = await pc.createAnswer();
      //@ts-ignore
      pc.setLocalDescription(sdp);
      const stream = new MediaStream();
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
      }

      setRemoteMediaStream(stream);
      // trickle ice
      setReceivingPc(pc);
      //@ts-ignore
      window.pcr = pc;
      pc.ontrack = (e) => {
        alert("ontrack");
        console.error("inside ontrack", e);
        // const {track, type} = e;
        // if (type == 'audio') {
        //     // setRemoteAudioTrack(track);
        //     // @ts-ignore
        //     remoteVideoRef.current.srcObject.addTrack(track)
        // } else {
        //     // setRemoteVideoTrack(track);
        //     // @ts-ignore
        //     remoteVideoRef.current.srcObject.addTrack(track)
        // }
        // //@ts-ignore
        // remoteVideoRef.current.play();
      };

      pc.onicecandidate = async (e) => {
        if (!e.candidate) {
          return;
        }
        console.log("omn ice candidate on receiving seide");
        if (e.candidate) {
          socket.emit("add-ice-candidate", {
            candidate: e.candidate,
            type: "receiver",
            roomId,
          });
        }
      };

      socket.emit("answer", {
        roomId,
        sdp: sdp,
      });
      setTimeout(() => {
        const track1 = pc.getTransceivers()[0].receiver.track;
        const track2 = pc.getTransceivers()[1].receiver.track;
        console.log(track1);
        if (track1.kind === "video") {
          setRemoteAudioTrack(track2);
          setRemoteVideoTrack(track1);
        } else {
          setRemoteAudioTrack(track1);
          setRemoteVideoTrack(track2);
        }
        //@ts-ignore
        remoteVideoRef.current.srcObject.addTrack(track1);
        //@ts-ignore
        remoteVideoRef.current.srcObject.addTrack(track2);
        //@ts-ignore
        remoteVideoRef.current.play();
        // if (type == 'audio') {
        //     // setRemoteAudioTrack(track);
        //     // @ts-ignore
        //     remoteVideoRef.current.srcObject.addTrack(track)
        // } else {
        //     // setRemoteVideoTrack(track);
        //     // @ts-ignore
        //     remoteVideoRef.current.srcObject.addTrack(track)
        // }
        // //@ts-ignore
      }, 5000);
    });

    socket.on("answer", ({ roomId, sdp: remoteSdp }) => {
      setLobby(false);
      setSendingPc((pc) => {
        pc?.setRemoteDescription(remoteSdp);
        return pc;
      });
      setRoomId(roomId);
      console.log("loop closed");
    });

    socket.on("lobby", () => {
      setLobby(true);
    });

    socket.on("add-ice-candidate", ({ candidate, type }) => {
      console.log("add ice candidate from remote");
      console.log({ candidate, type });
      if (type == "sender") {
        setReceivingPc((pc) => {
          if (!pc) {
            console.error("receicng pc nout found");
          } else {
            console.error(pc.ontrack);
          }
          pc?.addIceCandidate(candidate);
          return pc;
        });
      } else {
        setSendingPc((pc) => {
          if (!pc) {
            console.error("sending pc nout found");
          } else {
            // console.error(pc.ontrack)
          }
          pc?.addIceCandidate(candidate);
          return pc;
        });
      }
    });
    console.log("hello world");
    socket?.on("connect", () => {
      if (!socket.id) {
        return;
      }
      alert(socket.id);
    });

    socket?.on(
      "receive-message",
      ({
        message,
        roomId,
        socketId,
      }: {
        message: string;
        roomId: string;
        socketId: string;
      }) => {
        console.log("receing in client again", roomId, message, socketId);
        displayMessage(message);
      }
    );
    setSocket(socket);
  }, [name]);

  useEffect(() => {
    if (localVideoRef.current) {
      if (localVideoTrack) {
        localVideoRef.current.srcObject = new MediaStream([localVideoTrack]);
        localVideoRef.current.play();
      }
    }
  }, [localVideoRef]);

  const displayMessage = (msg: string) => {
    const box = document.getElementById("displayBox")!;
    const div = document.createElement("div");
    div.textContent = msg;
    box.append(div);
  };
  const handleSend = (e: any) => {
    e.preventDefault();
    const message = document.getElementsByTagName("input")[0].value;
    document.getElementsByTagName("input")[0].value = "";
    setMessage(message);
    displayMessage(message);
    console.log("message", { message, roomId });
    socket?.emit("send-message", {
      message,
      roomId,
    });
  };
  return (
    <RoomContainer>
      <Nav>
        <div>OmegleClone</div>
      </Nav>
      Hi {name}
      <VideoContainer>
        {localVideoRef && (
          <video autoPlay width={400} height={400} ref={localVideoRef} />
        )}
      </VideoContainer>
      {lobby ? "Waiting to connect you to someone" : null}
      <VideoContainer>
        {remoteVideoRef.current && (
          <video autoPlay width={400} height={400} ref={remoteVideoRef} />
        )}
      </VideoContainer>
      <ChattingContainer>
        <div id="displayBox"></div>
        <input type="Textarea" name="message" />
        <button onClick={handleSend}>Send</button>
      </ChattingContainer>
    </RoomContainer>
  );
};

const RoomContainer = styled.div`
  body: 0px;
  width: 100%;
`;
const Nav = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  height: 60px;
  background-color: blue;
  color: white;
`;
const VideoContainer = styled.div`
  display: block;
  margin-left: 20px;
`;
const ChattingContainer = styled.div`
  positon: fixed;
  bottom: 0;
  box-shadow: 0 0 0 0.2 black;
  width: 100vw;
  min-height: 100px;
  height: auto;
  display: flex;
  flex-direction: column;

  #displayBox {
    border-radius: 10px;
    width: 100%;
    min-height: 100px;
    height: 100%;
    background: #efefef;
    padding: 20px;
    text-size: 20px;
  }
`;
