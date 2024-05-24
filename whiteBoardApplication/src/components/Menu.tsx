import { ArrowDownToLine, Eraser, Pencil, Redo, Undo } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { menuItemClick, actionItemClick } from "../slice/menuSlice";
import { MENU_ITEMS } from "../constants";
import { RootState } from "../store";
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
  return (
    <>
      <div className="bg-slate-200 absolute top-5 left-1/4 flex justify-between items-center  h-8 w-2/4 rounded-md">
        <div className="bg-slate-200 w-full h-full flex justify-between items-center  rounded-md mx-0.5">
          <button
            type="button"
            className="text-white bg-white hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2  dark:hover:bg-blue-700 dark:focus:ring-blue-800 h-7 w-7"
            onClick={() => handleMenuClick(MENU_ITEMS.PENCIL)}
          >
            <Pencil color="#000000" strokeWidth={0.5} />
            {/* {activeMenuItem} */}
          </button>
          <button
            type="button"
            className="text-white bg-white hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2  dark:hover:bg-blue-700 dark:focus:ring-blue-800 h-7 w-7"
            onClick={() => handleMenuClick(MENU_ITEMS.ERASER)}
          >
            <Eraser size={16} strokeWidth={0.5} />
          </button>

          {/* </div> */}
          <button
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 h-7 w-7"
            onClick={() => handleActioItemClick(MENU_ITEMS.DOWNLOAD)}
          >
            <ArrowDownToLine color="#000000" strokeWidth={0.5} />
          </button>
          <button
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 h-7 w-7"
            onClick={() => handleActioItemClick(MENU_ITEMS.UNDO)}
          >
            <Undo size={16} strokeWidth={0.5} />
          </button>
          <button
            type="button"
            className="text-white mr-0 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 h-7 w-7"
            onClick={() => handleActioItemClick(MENU_ITEMS.REDO)}
          >
            <Redo size={16} strokeWidth={0.5} />
          </button>
        </div>
      </div>
    </>
  );
}

export default Menu;
