import { RootState } from "../store";
import { useEffect, useLayoutEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MENU_ITEMS } from "../constants";
import { actionItemClick } from "../slice/menuSlice";
import { useLocation } from "react-router-dom";

import socket from "../socket";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const Board = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const shouldDraw = useRef(false);
  const drawHistory = useRef<ImageData[]>([]);
  const historyPointer = useRef(0);
  const { activeMenuItem, actionMenuItem } = useSelector(
    (state: RootState) => state.menu
  );
  const { color, size } = useSelector(
    (state: RootState) => state.toolbox[activeMenuItem] || {}
  );

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    if (actionMenuItem === MENU_ITEMS.DOWNLOAD) {
      const URL = canvas.toDataURL();
      const anchor = document.createElement("a");
      anchor.href = URL;
      anchor.download = "sketch.jpg";
      anchor.click();
    } else if (
      actionMenuItem === MENU_ITEMS.UNDO ||
      actionMenuItem === MENU_ITEMS.REDO
    )
      if (drawHistory.current.length > 0) {
        if (historyPointer.current > 0 && actionMenuItem === MENU_ITEMS.UNDO)
          historyPointer.current -= 1;
        if (
          historyPointer.current < drawHistory.current.length - 1 &&
          actionMenuItem === MENU_ITEMS.REDO
        )
          historyPointer.current += 1;
        const imageData = drawHistory.current[historyPointer.current];
        context.putImageData(imageData, 0, 0);
      } else {
        if (actionMenuItem === MENU_ITEMS.UNDO) {
          toast.error("Cant do undo");
        } else if (actionMenuItem === MENU_ITEMS.REDO) {
          toast.error("Cant do redo");
        }
      }

    dispatch(actionItemClick(null));
  }, [actionMenuItem, dispatch]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context || !color || !size) return;

    const changeConfig = (color: string, size: number) => {
      context.strokeStyle = color;
      context.lineWidth = size;
    };

    const handleChangeConfig = (config: { color: string; size: number }) => {
      changeConfig(config.color, config.size);
    };

    changeConfig(color, size);
    socket.on("changeConfig", handleChangeConfig);

    return () => {
      socket.off("changeConfig", handleChangeConfig);
    };
  }, [color, size]);

  useLayoutEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const beginPath = (x: number, y: number) => {
      context.beginPath();
      context.moveTo(x, y);
    };

    const drawLine = (x: number, y: number) => {
      context.lineTo(x, y);
      context.stroke();
    };

    const handleMouseDown = (e: MouseEvent) => {
      console.log("mouseDown");
      shouldDraw.current = true;

      beginPath(e.clientX, e.clientY);
      socket.emit("beginPath", { x: e.clientX, y: e.clientY });
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!shouldDraw.current) return;
      drawLine(e.clientX, e.clientY);
      socket.emit("drawLine", { x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
      console.log("mouseUP");

      shouldDraw.current = false;
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      drawHistory.current.push(imageData);
      historyPointer.current = drawHistory.current.length - 1;
      console.log("drwa history:", drawHistory);
      console.log("drwa history pointer:", historyPointer);
    };

    const handleBeginPath = (path: { x: number; y: number }) => {
      beginPath(path.x, path.y);
    };

    const handleDrawLine = (path: { x: number; y: number }) => {
      drawLine(path.x, path.y);
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);

    socket.on("beginPath", handleBeginPath);
    socket.on("drawLine", handleDrawLine);
    console.log("location:", location.pathname);

    const fetchDrawing = async () => {
      const token = Cookies.get("token");
      try {
        const response = await axios.get(
          // "http://localhost:5000/api/getDrawing",
          "https://real-time-white-board-application.onrender.com/api/getDrawing",

          {
            headers: { Authorization: token },
          }
        );
        if (response.data.drawing) {
          const img = new Image();
          img.onload = () => {
            context.drawImage(img, 0, 0);
          };
          img.src = response.data.drawing;
        }
        // if (response.data.drawingHistory) {
        //   console.log("hostroy from backend:", response.data.drawingHistory);

        //   drawHistory.current = response.data.drawingHistory;
        // }
        console.log("Drawing history:", drawHistory.current);
      } catch (error) {
        console.error("Error fetching drawing:", error);
      }
    };

    fetchDrawing();

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);

      socket.off("beginPath", handleBeginPath);
      socket.off("drawLine", handleDrawLine);
    };
  }, []);

  useEffect(() => {
    const token = Cookies.get("token");

    const handleBeforeUnload = async (e: BeforeUnloadEvent) => {
      e.preventDefault();

      console.log("Before Unload");
      if (location.pathname === "/") {
        if (canvasRef.current) {
          const canvas = canvasRef.current;
          const dataURL = canvas.toDataURL();
          console.log("Saving drawing:", dataURL); // Add this log

          try {
            const response = await axios.post(
              // "http://localhost:5000/api/saveDrawing",
              "https://real-time-white-board-application.onrender.com/api/saveDrawing",

              {
                drawing: dataURL,
                // drawingHistory: drawHistory,
                token: token,
              }
            );
            console.log("Drawing saved:", response.data); // Add this log
          } catch (error) {
            console.error("Error saving drawing:", error); // Add this log
          }
        }
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload, {
      capture: true,
    });

    return () => {
      window.removeEventListener("unload", handleBeforeUnload);
    };
  }, [location.pathname]);

  return <canvas ref={canvasRef}></canvas>;
};

export default Board;
