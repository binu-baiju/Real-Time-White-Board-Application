import { useSelector, useDispatch } from "react-redux";
import { MENU_ITEMS, COLORS } from "../constants";
import { changeColor, changeBrushSize } from "../slice/toolBoxSlice";
import { RootState } from "../store";
import { ReactEventHandler } from "react";
import { menuItemClick } from "../slice/menuSlice";
import socket from "../socket";

function Toolbox() {
  const dispatch = useDispatch();
  const activeMenuItem = useSelector(
    (state: RootState) => state.menu.activeMenuItem
  );
  const { color, size } = useSelector(
    (state: RootState) => state.toolbox[activeMenuItem]
  );

  const updateBrushSize = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(changeBrushSize({ item: activeMenuItem, size: e.target.value }));
    socket.emit("changeConfig", { color, size: e.target.value });
  };

  const updateColor = (newColor: string) => {
    dispatch(changeColor({ item: activeMenuItem, color: newColor }));
    socket.emit("changeConfig", { color: newColor, size });
  };

  console.log(color, size, activeMenuItem);
  return (
    <div
      id="toolboxContainer"
      className="p-5 absolute top-1/4 left-5 lg:w-64 md:w-48 rounded-md border solid border-[#475569]"
    >
      <div id="toolboxItem" className="mb-5">
        <h4 id="toolboxText" className="text-xs">
          Stroke Color
        </h4>
        <div id="itemContainer" className="flex justify-between mt-2">
          <div
            className="h-5 w-5 mr-1 rounded-sm cursor-pointer hover:border border-solid border-[#d6d6d6] hover:shadow-[0_0_0_1px_#4a47b1] bg-black"
            onClick={() => updateColor(COLORS.BLACK)}
          ></div>
          <div
            className="h-5 w-5 mr-1 rounded-sm cursor-pointer hover:border border-solid border-[#d6d6d6] hover:shadow-[0_0_0_1px_#4a47b1] bg-red-500"
            onClick={() => updateColor(COLORS.RED)}
          ></div>
          <div
            className="h-5 w-5 mr-1 rounded-sm cursor-pointer hover:border border-solid border-[#d6d6d6] hover:shadow-[0_0_0_1px_#4a47b1] bg-green-500"
            onClick={() => updateColor(COLORS.GREEN)}
          ></div>
          <div
            className="h-5 w-5 mr-1 rounded-sm cursor-pointer hover:border border-solid border-[#d6d6d6] hover:shadow-[0_0_0_1px_#4a47b1] bg-blue-500"
            onClick={() => updateColor(COLORS.BLUE)}
          ></div>
          <div
            className="h-5 w-5 mr-1 rounded-sm cursor-pointer hover:border border-solid border-[#d6d6d6] hover:shadow-[0_0_0_1px_#4a47b1] bg-yellow-500"
            onClick={() => updateColor(COLORS.YELLOW)}
          ></div>
          <div
            className="h-5 w-5 mr-1 rounded-sm cursor-pointer hover:border border-solid border-[#d6d6d6] hover:shadow-[0_0_0_1px_#4a47b1] bg-orange-500"
            onClick={() => updateColor(COLORS.ORANGE)}
          ></div>
        </div>
      </div>
      <div id="toolboxItem" className="mb-5">
        <h4 id="toolboxText" className="text-xs">
          Brush Size
        </h4>
        <div id="itemContainer">
          <input
            type="range"
            name=""
            min={1}
            max={10}
            id=""
            className="cursor-pointer"
            onChange={updateBrushSize}
            value={size}
          />
        </div>
      </div>
    </div>
  );
}

export default Toolbox;
