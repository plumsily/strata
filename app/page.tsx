"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import io, { Socket } from "socket.io-client";
import * as fabric from "fabric";
import Forms from "@/components/Forms/Forms";
import Whiteboard from "@/components/Whiteboard";
import { ToolsProvider } from "@/components/context/ToolsProvider";
import { SocketProvider } from "@/components/context/SocketContext";
import { useSocket } from "@/components/context/SocketContext";

let socket: Socket;
let canvas: fabric.Canvas;

export interface ChildProps {
  uuid: () => string;
  socket: Socket;
  setUser: React.Dispatch<React.SetStateAction<object>>;
}

// const server = "http://localhost:5000";
// socket = io(server);

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState({});
  const socket = useSocket();

  useEffect(() => {
    socket.on("userIsJoined", (data) => {
      if (data.success) {
        console.log("userJoined");
      } else {
        console.log("userJoined error");
      }
    });
  }, []);

  // useEffect(() => {
  //   router.push("/whiteboard");
  // }, []);
  const uuid = () => {
    var S4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (
      S4() +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      S4() +
      S4()
    );
  };
  return (
    <>
      {/* <SocketProvider> */}
      <Forms uuid={uuid} socket={socket} setUser={setUser} />
      {/* </SocketProvider> */}
    </>
  );
  // <div>
  //   {/* <h1>Strata</h1> */}
  //   <canvas id="whiteboard" ref={canvasRef} className="border" />
  // </div>
}
