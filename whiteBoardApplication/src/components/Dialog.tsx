import { CopyIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";

import { useNavigate } from "react-router-dom";

import socket from "../socket";
import uuid from "../utils/uuid";
import { Share2 } from "lucide-react";

const notifyCopy = () => toast.success("Link Copied To Clipboard");
const notifyGenerate = (uuidnum: string) => toast.success(`Link Generated `);

console.log("uuidu", uuid());

export default function ShareDialog() {
  const [roomId, setRoomId] = useState(uuid());
  const [user, setUser] = useState({});
  const [name, setName] = useState("binu");
  const [hovered, setHovered] = useState(false);

  const navigate = useNavigate();

  const handleGenerateButton = () => {
    const uuidnum = uuid();
    console.log("uuid:", uuidnum);
    setRoomId(uuidnum);
    notifyGenerate(roomId);
  };

  const handleCreateSubmit = () => {
    console.log("hello");

    if (!name) {
      //  return toast.dark("Please enter your name!");
    }

    const roomData = {
      roomId,
      userId: uuid(),
      userName: name,
      host: true,
      presenter: true,
    };
    setUser({
      roomId,
      userId: uuid(),
      userName: name,
      host: true,
      presenter: true,
    });
    // setRoomJoined(true);
    // navigate("/");
    navigate(`/${roomId}`);
    socket.emit("userJoined", roomData);
  };

  return (
    <Dialog>
      <Toaster />

      <DialogTrigger
        asChild
        className="bg-slate-200 absolute top-5 left-[700px] lg:left-[1450px] flex justify-between items-center  h-8  w-12 lg:w-16 rounded-md"
      >
        <Button
          variant="outline"
          className="bg-[#6b67dc] hover:bg-[#5e5adb] flex justify-center items-center h-10"
        >
          <Share2 className="block lg:hidden" color="#ffffff" />
          <span className="hidden lg:block text-white">Share</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share link</DialogTitle>
          {/* <DialogDescription>Link</DialogDescription> */}
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="link"
              // defaultValue={`localhost:3000/${roomId}`}
              value={`${window.location.origin}/${roomId}`}
              readOnly
              className="focus-visible:ring-0"
            />
          </div>

          <Button
            type="submit"
            size="sm"
            className="px-3 h-10 bg-[#6b67dc] hover:text-black hover:bg-[#e0dfff]"
            onClick={handleGenerateButton}
          >
            Generate
          </Button>
          <CopyToClipboard
            text={`${window.location.origin}/${roomId}`}
            onCopy={() => {
              notifyCopy();
              handleCreateSubmit();
            }}
          >
            <Button
              type="submit"
              size="sm"
              className="parent group px-3 py-3 h-10 bg-[#6b67dc] hover:bg-[#e0dfff]"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              <span className="sr-only">Copy</span>
              <CopyIcon
                color={hovered ? "#000000" : "#ffffff"}
                className="child h-4 w-4 hover:fill-black"
              />
            </Button>
          </CopyToClipboard>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary" className="bg-[#e0dfff]">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
