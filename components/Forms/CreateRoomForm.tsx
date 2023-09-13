"use client";
import { useState } from "react";
import { Button, Form, Input } from "antd";
import { FC } from "react";
import { ChildProps } from "@/app/page";
import { useRouter } from "next/navigation";

type FieldType = {
  name?: string;
};
const CreateRoomForm: FC<ChildProps> = ({ uuid, socket, setUser }) => {
  const [roomId, setRoomId] = useState(uuid());
  const [name, setName] = useState("");

  const router = useRouter();

  const handleCreateRoom = (e: any) => {
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
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />{" "}
      </Form.Item>
      <Form.Item>
        <div className="flex gap-2">
          <Input value={roomId} disabled placeholder="Room ID" />
          <Button
            className="bg-[#1677FF]"
            type="primary"
            onClick={() => setRoomId(uuid())}
          >
            Generate
          </Button>
          <Button>Copy</Button>
        </div>
      </Form.Item>
      <Form.Item>
        <Button
          className="bg-[#1677FF] w-full"
          type="primary"
          onClick={handleCreateRoom}
        >
          Generate Room
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateRoomForm;
