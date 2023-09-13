import JoinRoomForm from "./JoinRoomForm";
import CreateRoomForm from "./CreateRoomForm";
import { ChildProps } from "@/app/page";
import { FC } from "react";

const Forms: FC<ChildProps> = ({ uuid, socket, setUser }) => {
  return (
    <div className="flex w-full h-screen justify-center items-center">
      <div className="w-1/2 h-full relative flex flex-col gap-6 justify-center items-center bg-gradient-to-tl from-[#FF5A4B]/70 from-45% to-55% to-[#FFB44B]/70">
        <h1 className="absolute top-0 left-0 py-1 px-2 text-4xl font-semibold uppercase">
          Strata
        </h1>
        <h2 className="text-2xl font-semibold">Create Room</h2>
        <CreateRoomForm uuid={uuid} socket={socket} setUser={setUser} />
      </div>
      <div className="w-1/2 h-full relative flex flex-col gap-6 justify-center items-center bg-gradient-to-tr from-[#5A4BFF] from-45% to-55% to-[#1677FF] text-white">
        <h1 className="absolute top-0 right-0 py-1 px-2 text-4xl font-medium text-white uppercase text-right">
          A real-time <br></br> collaborative whiteboard
        </h1>
        <h2 className="text-2xl font-semibold">Join Room</h2>
        <JoinRoomForm uuid={uuid} socket={socket} setUser={setUser} />
      </div>
    </div>
  );
};

export default Forms;
