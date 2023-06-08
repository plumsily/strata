"use client";
import { useState, useEffect, useRef } from "react";
import io, { Socket } from "socket.io-client";
import * as fabric from "fabric";
import Whiteboard from "@/components/Whiteboard";
import { ToolsProvider } from "@/components/context/ToolsProvider";

let socket: Socket;
let canvas: fabric.Canvas;

export default function Home() {
  // const [roomId, setRoomId] = useState("");
  // const [username, setUsername] = useState("");

  // const handleJoinRoom = () => {};
  // const handleCreateRoom = () => {};

  // const canvasRef = useRef<HTMLCanvasElement>(null);
  // const socketRef = useRef<Socket>();
  // const canvas = useRef<fabric.Canvas>();

  // const canvasRef = useRef<HTMLCanvasElement>(null);

  // useEffect(() => {
  //   socket = io("http://localhost:5000"); // Connect to the server
  //   canvas = new fabric.Canvas(canvasRef.current as HTMLCanvasElement, {
  //     isDrawingMode: true,
  //     width: window.innerWidth,
  //     height: window.innerHeight,
  //   });
  //   // Enable drawing mode
  //   canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
  //   canvas.freeDrawingBrush.color = "black";
  //   canvas.freeDrawingBrush.width = 1;

  //   // Event handler for path creation
  //   canvas.on("path:created", (opt: any) => {
  //     const path = opt.path;
  //     socket.emit(
  //       "draw",
  //       path.toObject(["path", "stroke", "strokeWidth"])
  //       // path.toObject(["x1", "y1", "x2", "y2", "width", "height"])
  //     ); // Emit path data
  //   });

  //   // Event handler for socket draw event
  //   socket.on("draw", async (data: any) => {
  //     const path = fabric.Path.fromObject(data);
  //     canvas.add(await path);
  //     canvas.renderAll();
  //   });

  //   // Handle window resize
  //   window.addEventListener("resize", () => {
  //     canvas.setDimensions({
  //       width: window.innerWidth,
  //       height: window.innerHeight,
  //     });
  //   });
  // }, []);

  return (
    <ToolsProvider>
      <Whiteboard></Whiteboard>
    </ToolsProvider>
    // <div>
    //   {/* <h1>Strata</h1> */}
    //   <canvas id="whiteboard" ref={canvasRef} className="border" />
    // </div>
  );
}
