import { ArrowDownToLine, Eraser, Pencil, Redo, Undo } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { menuItemClick, actionItemClick } from "../slice/menuSlice";
import { MENU_ITEMS } from "../constants";
import { RootState } from "../store";
import { Button } from "./ui/button";
// import ShareDialog from "./Dialog";
function Menu() {
  const dispatch = useDispatch();
  const activeMenuItem = useSelector(
    (state: RootState) => state.menu.activeMenuItem
  );
  const handleMenuClick = (itemName: string) => {
    dispatch(menuItemClick(itemName));
  };

  const handleActioItemClick = (itemName: string) => {
    dispatch(actionItemClick(itemName));
  };

  const isActive = (itemName: string) => itemName === activeMenuItem;

  return (
    <>
      <div className="bg-white absolute top-5 left-1/4 lg:left-[600px] flex justify-between items-center  h-10 w-2/4 lg:w-96 rounded-md drop-shadow-xl">
        <div className="bg-white w-full h-full flex justify-between items-center  rounded-md mx-0.5">
          <Button
            // type="button"
            className={`text-white bg-white hover:bg-[#e0dfff] ${
              isActive(MENU_ITEMS.PENCIL) ? "bg-[#e0dfff]" : "bg-white"
            }   font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2  dark:hover:bg-blue-700  h-9 w-9`}
            onClick={() => handleMenuClick(MENU_ITEMS.PENCIL)}
          >
            <Pencil color="#000000" size={16} strokeWidth={1.5} />
            {/* {activeMenuItem} */}
          </Button>
          <button
            type="button"
            className={`text-white bg-white hover:bg-[#e0dfff] ${
              isActive(MENU_ITEMS.ERASER) ? "bg-[#e0dfff]" : "bg-white"
            }   font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2  dark:hover:bg-blue-700 dark:focus:ring-blue-800 h-9 w-9`}
            onClick={() => handleMenuClick(MENU_ITEMS.ERASER)}
          >
            <Eraser size={16} color="#000000" strokeWidth={1.5} />
          </button>

          {/* </div> */}
          <button
            type="button"
            className="text-white bg-white hover:bg-[#e0dfff] focus:bg-[#e0dfff]  font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 h-9 w-9"
            onClick={() => handleActioItemClick(MENU_ITEMS.DOWNLOAD)}
          >
            <ArrowDownToLine color="#000000" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            className="text-white bg-white hover:bg-[#e0dfff]  font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2   h-9 w-9"
            onClick={() => handleActioItemClick(MENU_ITEMS.UNDO)}
          >
            <Undo size={16} strokeWidth={1.5} color="#000000" />
          </button>
          <button
            type="button"
            className="text-white mr-0 bg-white hover:bg-[#e0dfff]  font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2   h-9 w-9"
            onClick={() => handleActioItemClick(MENU_ITEMS.REDO)}
          >
            <Redo size={16} strokeWidth={1.5} color="#000000" />
          </button>
        </div>
      </div>
    </>
  );
}

export default Menu;
