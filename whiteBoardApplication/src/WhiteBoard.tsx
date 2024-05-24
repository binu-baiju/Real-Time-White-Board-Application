import Board from "./components/Board";
import Menu from "./components/Menu";
import Toolbox from "./components/Toolbox";
import { User } from "./types/stateTypes.ts";

const WhiteBoard = (user: User) => {
  console.log("user:", user);
  return (
    <div className="">
      <Menu />
      <Toolbox />
      <Board />
    </div>
  );
};

export default WhiteBoard;
