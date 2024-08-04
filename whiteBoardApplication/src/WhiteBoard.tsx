import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Board from "./components/Board";
import ShareDialog from "./components/Dialog.tsx";
import Menu from "./components/Menu";
import Toolbox from "./components/Toolbox";
import { User } from "./types/stateTypes.ts";

import uuid from "./utils/uuid.ts";
import socket from "./socket.ts";
import Cookies from "js-cookie";

const WhiteBoard = (user: User) => {
  const { roomId } = useParams();
  const [isSender, setIsSender] = useState<boolean>(false);
  const [isRealTime, setIsRealTime] = useState<boolean>(!!roomId);
  console.log(roomId);
  const token = Cookies.get("token");
  console.log("token:", token);

  useEffect(() => {
    if (roomId) {
      const roomData = {
        roomId,
        userId: uuid(),
        userName: user.userName || "Anonymous",
        host: false,
        presenter: false,
      };
      socket.emit("userJoined", roomData);

      socket.on("userJoined", (data: any) => {
        if (data.host) {
          setIsSender(true);
        }
      });
    } else {
      // Single-user mode
      setIsRealTime(false);
    }
  }, [roomId, user.userName]);

  console.log("user:", user);
  console.log("user:", isRealTime);
  console.log("user:", isSender);

  return (
    <div className="">
      <div className="overflow-y-hidden lg:overflow-x-hidden">
        <div></div>
        {(!isRealTime || isSender) && <Menu />}
        {(!isRealTime || isSender) && <Toolbox />}
        <ShareDialog />
        <Board />
      </div>
    </div>
  );
};

export default WhiteBoard;
