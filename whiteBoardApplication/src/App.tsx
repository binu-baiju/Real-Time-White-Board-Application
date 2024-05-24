import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Menu from "./components/Menu";
import Toolbox from "./components/Toolbox";
import Board from "./components/Board";
import WhiteBoard from "./WhiteBoard";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import JoinCreateRoom from "./forms/JoinCeateRoom";

function App() {
  const [user, setUser] = useState({});
  const uuid = () => {
    const S4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (
      S4() +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      S4() +
      S4()
    );
  };

  console.log("uuidu", uuid());

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WhiteBoard />}></Route>
        <Route
          path="/forms"
          element={<JoinCreateRoom uuid={uuid} setUser={setUser} user={user} />}
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
