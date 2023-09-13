"use client";
import { MotionConfig } from "framer-motion";
import { ToastContainer } from "react-toastify";
import { RecoilRoot } from "recoil";
import { SocketProvider } from "@/components/context/SocketContext";
import "react-toastify/dist/ReactToastify.css";
import { DEFAULT_EASE } from "@/lib/constants";

export default function ParentWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SocketProvider>
      <RecoilRoot>
        <ToastContainer />
        <MotionConfig transition={{ ease: DEFAULT_EASE }}>
          {children}
        </MotionConfig>
      </RecoilRoot>
    </SocketProvider>
  );
}
