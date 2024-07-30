import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Menu from "./components/Menu";
import Toolbox from "./components/Toolbox";
import Board from "./components/Board";
import WhiteBoard from "./WhiteBoard";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import JoinCreateRoom from "./forms/JoinCeateRoom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoutes";
import VerifyEmail from "./pages/verifyEmail";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
// import Signup from "./pages/signup";

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

  // useEffect(() => {
  //   const handleBeforeUnload = (e: BeforeUnloadEvent) => {
  //     e.preventDefault();
  //     return (e.returnValue = "");
  //   };

  //   window.addEventListener("beforeunload", handleBeforeUnload);

  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //   };
  // }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/:roomId" element={<WhiteBoard />}></Route>
        <Route path="/" element={<WhiteBoard />}></Route> */}
        <Route path="/:roomId" element={<WhiteBoard />} />

        <Route path="/" element={<ProtectedRoute />}>
          <Route path="/" element={<WhiteBoard />} />
        </Route>
        <Route
          path="/forms"
          element={<JoinCreateRoom uuid={uuid} setUser={setUser} user={user} />}
        ></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route
          path="/verify-email/:verificationCode"
          element={<VerifyEmail />}
        ></Route>
        <Route
          path="/reset-password/:token"
          element={<ResetPassword />}
        ></Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
