import "./globals.css";
import { Inter } from "next/font/google";
import { Space_Grotesk } from "next/font/google";
import { MotionConfig } from "framer-motion";
import { ToastContainer } from "react-toastify";
import { RecoilRoot } from "recoil";
import { SocketProvider } from "@/components/context/SocketContext";
import ParentWrapper from "@/components/ParentWrapper";

import "react-toastify/dist/ReactToastify.css";

import { DEFAULT_EASE } from "@/lib/constants";

const inter = Inter({ subsets: ["latin"] });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

export const metadata = {
  title: "Strata | Collaborative Whiteboard",
  description: "Online collaborative whiteboard app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={spaceGrotesk.className}>
        <ParentWrapper>{children}</ParentWrapper>
      </body>
    </html>
  );
}
