import JoinRoomForm from "./JoinRoomForm";
import CreateRoomForm from "./CreateRoomForm";
import { ChildProps } from "@/app/page";
import { FC } from "react";

const Forms: FC<ChildProps> = ({ uuid, socket, setUser }) => {
  return (
    <div className="flex w-full h-screen justify-center items-center">
      <div className="w-1/2 h-full flex flex-col gap-6 justify-center items-center">
        <h2 className="text-2xl font-semibold">Create Room</h2>
        <CreateRoomForm uuid={uuid} socket={socket} setUser={setUser} />
      </div>
      <div className="w-1/2 h-full flex flex-col gap-6 justify-center items-center bg-[#1677FF] text-white">
        <h2 className="text-2xl font-semibold">Join Room</h2>
        <JoinRoomForm uuid={uuid} socket={socket} setUser={setUser} />
      </div>
    </div>
  );
};

export default Forms;
