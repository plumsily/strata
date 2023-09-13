import { Button, Form, Input } from "antd";
import { ChildProps } from "@/app/page";
import { FC, useState } from "react";
import { useRouter } from "next/navigation";
import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

type FieldType = {
  name?: string;
};
const JoinRoomForm: FC<ChildProps> = ({ uuid, socket, setUser }) => {
  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState("");

  const router = useRouter();

  const handleJoinRoom = (e: any) => {
    e.preventDefault();

    const roomData = {
      name,
      roomId,
      userId: uuid(),
    };
    setUser(roomData);
    router.push(`/room/${roomId}`);
    socket.emit("userJoined", roomData);
  };

  return (
    <Form
      name="basic"
      style={{ minWidth: 400, maxWidth: 800 }}
      initialValues={{ remember: true }}
    >
      <Form.Item<FieldType>
        rules={[{ required: true, message: "Please input your name!" }]}
      >
        <Input
          className={spaceGrotesk.className}
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />{" "}
      </Form.Item>
      <Form.Item>
        <Input
          className={spaceGrotesk.className}
          placeholder="Room ID"
          onChange={(e) => setRoomId(e.target.value)}
        />
      </Form.Item>
      <Form.Item>
        <Button
          className={`bg-white text-[#1677FF] ${spaceGrotesk.className} w-full`}
          type="primary"
          onClick={handleJoinRoom}
        >
          Join Room
        </Button>
      </Form.Item>
    </Form>
  );
};

export default JoinRoomForm;
