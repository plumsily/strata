import { createServer } from "http";
import { Server, Socket } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket: Socket) => {
  console.log("a user connected");
  socket.on("draw", (data: any) => {
    // Broadcast the drawing data to all connected clients
    console.log("drawing");
    socket.broadcast.emit("draw", data);
  });
  socket.on("modify", (data) => {
    console.log(`Object with id ${data.id} modified with data: `, data);

    // broadcast the modify event to all other clients
    socket.broadcast.emit("modify", data);
  });
});

httpServer.listen(5000, () => {
  console.log("Socket.IO server running on port 5000");
});
