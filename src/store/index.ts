import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "./slices/tasksSlice.ts";
import notesReducer from "./slices/notesSlice.ts";
import weatherReducer from "./slices/weatherSlice.ts";
import themeReducer from "./slices/themeSlice.ts";
import languageReducer from "./slices/languageSlice.ts";

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    notes: notesReducer,
    weather: weatherReducer,
    theme: themeReducer,
    language: languageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
