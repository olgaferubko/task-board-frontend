import { configureStore } from "@reduxjs/toolkit";
import { boardsReducer } from "./slices/boards";
import { cardsReducer } from "./slices/cards";
import { useDispatch } from "react-redux";

import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  boards: boardsReducer,
  cards: cardsReducer,
});

const persistConfig = {
  key: "task-board",   
  storage,
  whitelist: ["boards", "cards"], 
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
