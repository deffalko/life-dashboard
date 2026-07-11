import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "./slices/tasksSlice";
import notesReducer from "./slices/notesSlice";
import weatherReducer from "./slices/weatherSlice";
import themeReducer from "./slices/themeSlice";
import languageReducer from "./slices/languageSlice";

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
