"use client";
import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextProps {
  socket: Socket;
}

export const newSocket = io("https://strata-server.adaptable.app/");

const SocketContext = createContext<Socket>(newSocket);

export const useSocket = () => {
  return useContext(SocketContext);
};

const server = "https://strata-server.adaptable.app/";

export const SocketProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [socket, setSocket] = useState<Socket>(newSocket);

  useEffect(() => {
    const newSocket = io(server);
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
