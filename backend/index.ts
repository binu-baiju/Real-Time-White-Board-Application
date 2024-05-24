const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});
let roomIdGlobal: string;
let beginPathData: any;
let drawLineData: any;
let changeConfigData: any;
io.on("connection", (socket: any) => {
  console.log("server connected");

  socket.on("userJoined", (data: any) => {
    const { userName, userId, roomId, host, presenter } = data;
    roomIdGlobal = roomId;
    console.log(roomId);
    socket.join(roomId);
    socket.emit("userIsJoined", {
      success: true,
      roomIdNumber: roomId,
      host: host,
    });
    if (beginPathData) {
      socket.emit("beginPath", beginPathData);
    }
    if (drawLineData) {
      socket.emit("drawLine", drawLineData);
    }
    if (changeConfigData) {
      socket.emit("changeConfig", changeConfigData);
    }
    // socket.broadcast.emit("beginPath", arg);
  });

  socket.on("beginPath", (arg: any) => {
    beginPathData = arg;
    socket.broadcast.to(roomIdGlobal).emit("beginPath", arg);
  });

  socket.on("drawLine", (arg: any) => {
    drawLineData = arg;
    socket.broadcast.to(roomIdGlobal).emit("drawLine", arg);
  });

  socket.on("changeConfig", (arg: any) => {
    changeConfigData = arg;
    socket.broadcast.to(roomIdGlobal).emit("changeConfig", arg);
  });
});

httpServer.listen(5000);
