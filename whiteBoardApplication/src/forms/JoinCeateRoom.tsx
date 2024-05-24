import React, {
  Dispatch,
  ReactEventHandler,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
// import { toast } from "react-toastify";
import socket from "../socket";
import { User } from "../types/stateTypes.ts";
import { useNavigate } from "react-router-dom";

interface JoinCreateRoomProps {
  uuid: () => string;
  setUser: Dispatch<SetStateAction<object>>;
  user: User;
}

const JoinCreateRoom: React.FC<JoinCreateRoomProps> = ({
  uuid,
  setUser,
  user,
}) => {
  // setUser, setRoomJoined
  const [roomId, setRoomId] = useState(uuid());
  const [name, setName] = useState("");
  const [joinName, setJoinName] = useState("");
  const [joinRoomId, setJoinRoomId] = useState("");
  const navigate = useNavigate();

  const handleCreateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
    navigate("/");
    socket.emit("userJoined", roomData);
  };
  const handleJoinSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!joinName) {
      // return toast.dark("Please enter your name!");
    }

    const joinRoomData = {
      roomId: joinRoomId,
      userId: uuid(),
      userName: joinName,
      host: false,
      presenter: false,
    };

    setUser({
      roomId: joinRoomId,
      userId: uuid(),
      userName: joinName,
      host: false,
      presenter: false,
    });
    //     setRoomJoined(true);
    navigate("/");

    socket.emit("userJoined", joinRoomData);
  };

  useEffect(() => {
    socket.on("userIsJoined", (data) => {
      if (data.success) {
        console.log("user joined", data.roomIdNumber, "host:", data.host);
      } else {
        console.log("something went wrong");
      }
    });
  });

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <h1 className="text-center my-5">
            Welcome To Realtime Whiteboard Sharing App
          </h1>
        </div>
      </div>
      <div className="row mx-5 mt-5">
        <div className="col-md-5 p-5 border mx-auto">
          <h1 className="text-center text-primary mb-5">Create Room</h1>
          <form onSubmit={handleCreateSubmit}>
            <div className="form-group my-2">
              <input
                type="text"
                placeholder="Name"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="input-group my-2 border align-items-center">
              <input
                type="text"
                className="form-control border-0 outline-0"
                value={roomId}
                readOnly={true}
                // style={{
                //   boxShadow: "none",
                //   zIndex: "0 !important",
                //   fontsize: "0.89rem !important",
                // }}
              />
              <div className="input-group-append">
                <button
                  className="btn btn-outline-primary  border-0 btn-sm"
                  type="button"
                  onClick={() => setRoomId(uuid())}
                >
                  Generate
                </button>
                &nbsp;&nbsp;
                <CopyToClipboard
                  text={roomId}
                  //   onCopy={() => toast.success("Room Id Copied To Clipboard!")}
                >
                  <button
                    className="btn btn-outline-dark border-0 btn-sm"
                    type="button"
                  >
                    Copy
                  </button>
                </CopyToClipboard>
              </div>
            </div>
            <div className="form-group mt-5">
              <button type="submit" className="form-control btn btn-dark">
                Create Room
              </button>
            </div>
          </form>
        </div>
        <div className="col-md-5 p-5 border mx-auto">
          <h1 className="text-center text-primary mb-5">Join Room</h1>
          <form onSubmit={handleJoinSubmit}>
            <div className="form-group my-2">
              <input
                type="text"
                placeholder="Name"
                className="form-control"
                value={joinName}
                onChange={(e) => setJoinName(e.target.value)}
              />
            </div>
            <div className="form-group my-2">
              <input
                type="text"
                className="form-control outline-0"
                value={joinRoomId}
                onChange={(e) => setJoinRoomId(e.target.value)}
                placeholder="Room Id"
                style={{
                  boxShadow: "none",
                }}
              />
            </div>
            <div className="form-group mt-5">
              <button type="submit" className="form-control btn btn-dark">
                Join Room
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JoinCreateRoom;
