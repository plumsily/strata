"use client";
import { useState, useEffect, useRef, useContext } from "react";
import io, { Socket } from "socket.io-client";
import * as fabric from "fabric";
import Toolbar from "./Toolbar";
import { ToolsContext } from "./context/ToolsProvider";
import { v4 as uuidv4 } from "uuid";
import { useSocket } from "./context/SocketContext";

// let socket: Socket;
let canvasInstance: fabric.Canvas;

interface FabricObjectWithID extends fabric.BaseFabricObject {
  id: string;
}

export default function Whiteboard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasInstanceRef = useRef<fabric.Canvas | null>(null);

  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [drawingObject, setDrawingObject] = useState<
    fabric.Rect | fabric.Line | null
  >(null);
  //   const [tool, setTool] = useState<string>("pencil");
  const { setTool, tool, colorHex, width } = useContext(ToolsContext);

  const socket = useSocket();

  //   const [dev, setDev] = useState<string>("pending");

  // const [roomId, setRoomId] = useState("");
  // const [username, setUsername] = useState("");

  // const handleJoinRoom = () => {};
  // const handleCreateRoom = () => {};

  // const canvasRef = useRef<HTMLCanvasElement>(null);
  // const socketRef = useRef<Socket>();
  // const canvasInstance = useRef<fabric.Canvas>();

  useEffect(() => {
    // socket = io("http://localhost:5000"); // Connect to the server
    canvasInstance = new fabric.Canvas(canvasRef.current as HTMLCanvasElement, {
      isDrawingMode: true,
      width: window.innerWidth,
      height: window.innerHeight,
    });
    // Enable drawing mode
    canvasInstance.freeDrawingBrush = new fabric.PencilBrush(canvasInstance);
    canvasInstance.freeDrawingBrush.color = "black";
    canvasInstance.freeDrawingBrush.width = 1;

    canvasInstanceRef.current = canvasInstance;

    const pathCreatedHandler = (opt: any) => {
      const path = opt.path;
      path.id = uuidv4();
      socket.emit(
        "draw",
        path.toObject(["path", "stroke", "strokeWidth"])
        // path.toObject(["x1", "y1", "x2", "y2", "width", "height"])
      ); // Emit path data
    };

    // Event handler for path creation
    canvasInstance.on("path:created", pathCreatedHandler);

    // Handler function for object modifications
    const objectModifiedHandler = (opt: any) => {
      const modifiedObject = opt.target;
      socket.emit("modify", modifiedObject.toObject());
    };

    // Add the object modified handler to the canvas
    canvasInstance.on("object:modified", objectModifiedHandler);

    // Event handler for socket draw event
    socket.on("draw", async (data: any) => {
      const path = fabric.util
        .enlivenObjects([data], {
          reviver: (serializedObj, instance) => {
            const origRenderOnAddRemove = canvasInstance.renderOnAddRemove;
            canvasInstance.renderOnAddRemove = false;
            canvasInstance.add(instance);
            canvasInstance.renderOnAddRemove = origRenderOnAddRemove;
            canvasInstance.renderAll();
          },
        })
        .catch((error) => {
          console.error("Error in enlivenObjects: ", error);
        });
    });
    // socket.on("draw", async (data: any) => {
    //   fabric.Object.fromObject<any>(data)
    //     .then((deserializedObj) => {
    //       if (deserializedObj) {
    //         deserializedObj.id = data.id; // Make sure the original ID is set
    //         const origRenderOnAddRemove = canvasInstance.renderOnAddRemove;
    //         canvasInstance.renderOnAddRemove = false;
    //         canvasInstance.add(deserializedObj as fabric.BaseFabricObject);
    //         canvasInstance.renderOnAddRemove = origRenderOnAddRemove;
    //         canvasInstance.renderAll();
    //       }
    //     })
    //     .catch((error: Error) => {
    //       console.error("Error in fromObject: ", error);
    //     });
    // });

    socket.on("modify", async (data: any) => {
      const id = data.id;
      const modifiedObject = canvasInstance
        .getObjects()
        .find((obj) => (obj as FabricObjectWithID).id === id);

      if (modifiedObject) {
        modifiedObject.set(data);
        canvasInstance.renderAll();
      } else {
        console.error(`Object with id ${id} not found`);
      }
    });

    // Handle window resize
    window.addEventListener("resize", () => {
      canvasInstance.setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    });

    // Set the canvas instance in the state so it can be passed
    setCanvas(canvasInstance);

    // Remove the handler when component unmounts
    return () => {
      canvasInstance.off("object:modified", objectModifiedHandler);
      canvasInstance.off("path:created", pathCreatedHandler);
    };
  }, []);

  useEffect(() => {
    if (canvasInstanceRef.current) {
      const canvasInstanceCurrent = canvasInstanceRef.current;

      const mouseDownHandler = (o: { e: fabric.TPointerEvent }) => {
        const pointer = canvasInstanceCurrent.getPointer(o.e);
        if (!canvasInstanceCurrent.isDrawingMode) {
          switch (tool) {
            case "line":
              const line = new fabric.Line(
                [pointer.x, pointer.y, pointer.x, pointer.y],
                {
                  id: uuidv4(),
                  stroke: colorHex,
                  strokeWidth: width,
                  selectable: false,
                }
              );
              setDrawingObject(line);
              canvasInstanceCurrent.add(line);

              break;
            case "rectangle":
              const rectangle = new fabric.Rect({
                id: uuidv4(),
                left: pointer.x,
                top: pointer.y,
                originX: "left",
                originY: "top",
                width: 0,
                height: 0,
                stroke: colorHex,
                strokeWidth: width,
                fill: "transparent",
                selectable: false,
              });
              setDrawingObject(rectangle);
              canvasInstanceCurrent.add(rectangle);
              break;
            case "text":
              const text = new fabric.IText("Edit me", {
                id: uuidv4(),
                left: pointer.x,
                top: pointer.y,
                fill: colorHex,
                fontSize: 20,
                width: 300,
                editable: true,
              });
              canvasInstanceCurrent.add(text);
              setTool("move");
              canvasInstanceCurrent.isDrawingMode = false;
              canvasInstanceCurrent.selection = true;
              canvasInstanceCurrent.forEachObject(function (object) {
                object.set("selectable", true);
              });
              break;
            default:
              break;
          }
        }
      };
      const mouseMoveHandler = (o: { e: fabric.TPointerEvent }) => {
        if (!canvasInstanceCurrent.isDrawingMode && drawingObject) {
          const pointer = canvasInstanceCurrent.getPointer(o.e);
          if (tool === "line") {
            const line = drawingObject as fabric.Line;
            line.set({ x2: pointer.x, y2: pointer.y });
          } else if (tool === "rectangle") {
            const rectangle = drawingObject as fabric.Rect;
            rectangle.set({
              width: Math.abs(pointer.x - rectangle.left),
              height: Math.abs(pointer.y - rectangle.top),
            });
            if (rectangle.left > pointer.x) {
              rectangle.set({ originX: "right" });
            } else {
              rectangle.set({ originX: "left" });
            }
            if (rectangle.top > pointer.y) {
              rectangle.set({ originY: "bottom" });
            } else {
              rectangle.set({ originY: "top" });
            }
          }
          drawingObject.setCoords();
          canvasInstanceCurrent.renderAll();
        }
      };
      const mouseUpHandler = (o: any) => {
        if (!canvasInstanceCurrent.isDrawingMode && drawingObject) {
          //   canvasInstanceCurrent.add(drawingObject);
          //   setDrawingObject(null);
          if (tool === "line" || tool === "rectangle") {
            socket.emit("draw", drawingObject.toObject());
          }
          setDrawingObject(null);
        }
      };

      // Set up handlers inside useEffect.
      canvasInstanceCurrent.on("mouse:down", mouseDownHandler);
      canvasInstanceCurrent.on("mouse:move", mouseMoveHandler);
      canvasInstanceCurrent.on("mouse:up", mouseUpHandler);

      // Return a cleanup function.
      return () => {
        canvasInstanceCurrent.off("mouse:down", mouseDownHandler);
        canvasInstanceCurrent.off("mouse:move", mouseMoveHandler);
        canvasInstanceCurrent.off("mouse:up", mouseUpHandler);
      };
    }
  }, [tool, drawingObject, canvasInstanceRef]);

  return (
    <>
      <Toolbar canvas={canvas} />
      <canvas id="whiteboard" ref={canvasRef} className="border" />
    </>
  );
}
