import { combineReducers, configureStore, createListenerMiddleware, TypedStartListening } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useSelector } from "react-redux";

import csvReducer from "./slices/csvEditorSlice";
import messageReducer from "./slices/messageSlice";
import safeInfoReducer from "./slices/safeInfoSlice";

const listenerMiddlewareInstance = createListenerMiddleware({
  onError: () => console.error,
});

const rootReducer = combineReducers({
  csvEditor: csvReducer,
  messages: messageReducer,
  safeInfo: safeInfoReducer,
});

export const makeStore = (initialState?: Record<string, any>) =>
  configureStore({
    reducer: rootReducer,
    preloadedState: initialState,
  });

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = ReturnType<typeof makeStore>["dispatch"];

export type AppStartListening = TypedStartListening<RootState, AppDispatch>;

export const startAppListening = listenerMiddlewareInstance.startListening as AppStartListening;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
