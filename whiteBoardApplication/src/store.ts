import { configureStore } from "@reduxjs/toolkit";
import MenuReducer from "./slice/menuSlice";
import ToolboxReducer from "./slice/toolBoxSlice";
import { MenuState } from "./types/stateTypes";

export const store = configureStore({
  reducer: {
    menu: MenuReducer,
    toolbox: ToolboxReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
