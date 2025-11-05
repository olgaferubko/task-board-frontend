import { configureStore } from "@reduxjs/toolkit";
import { boardsReducer } from "./slices/boards";
import { cardsReducer } from "./slices/cards";
import { useDispatch } from "react-redux";

export const store = configureStore({
  reducer: {
    boards: boardsReducer,
    cards: cardsReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
