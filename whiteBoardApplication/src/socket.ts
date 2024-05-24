import { io } from "socket.io-client";
const URL =
  process.env.NODE_ENV === "production"
    ? "https://real-time-white-board-application.onrender.com"
    : "http://localhost:5000";
const socket = io(URL);

export default socket;
