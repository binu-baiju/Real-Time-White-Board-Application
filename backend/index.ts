const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const bodyParser = require("body-parser");
import dotenv from "dotenv";

import authRoutes from "./routes/auth";
import savingDrawingRoutes from "./routes/savingDrawing";
import getDrawingRoutes from "./routes/getDrawing";
import verifyEmailRoutes from "./routes/verifyEmail";
import sendForgotPasswordEmail from "./routes/sendForgotPasswordEmail";
import resetPassword from "./routes/resetPassword";

dotenv.config();

const MongoDB_URI = process.env.MONGODB_URI;

const mongoose = require("mongoose");

mongoose.connect(MongoDB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Check connection status
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to MongoDB");
});

const app = express();

// app.use(express.json());
app.use(bodyParser.json({ limit: "50mb" }));

const isDev = app.settings.env === "development";
console.log(isDev);
const url = isDev
  ? "http://localhost:5173"
  : "https://real-time-white-board-application.netlify.app";
console.log(url);
app.use(cors({ origin: [url, "http://localhost:5173"], credentials: true }));

app.use("/api/auth", authRoutes);
app.use("/api", savingDrawingRoutes);
app.use("/api", getDrawingRoutes);
app.use("/api", verifyEmailRoutes);
app.use("/api", sendForgotPasswordEmail);
app.use("/api", resetPassword);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: url,
    methods: ["GET", "POST"],
  },
});
let roomIdGlobal: string;
let beginPathData: any;
let drawLineData: any;
let changeConfigData: any;
let menuItemData: any;
let imageDataInServer: any;

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
    if (menuItemData) {
      socket.emit("menuItemClick", menuItemData);
    }

    if (imageDataInServer) {
      console.log("reciecved undo redo 2");

      socket.emit("undoorredoaction", imageDataInServer);
    }
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

  socket.on("menuItemClick", (arg: any) => {
    menuItemData = arg;
    socket.broadcast.to(roomIdGlobal).emit("menuItemClick", arg);
  });

  socket.on("undoorredoaction", (imageDataURL: any) => {
    console.log("reciecved undo redo 1");
    imageDataInServer = imageDataURL;
    socket.broadcast.to(roomIdGlobal).emit("undoorredoaction", imageDataURL);
  });
});

httpServer.listen(5000);
