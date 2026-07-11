import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LanguageState {
  currentLanguage: "ru" | "en";
}

const loadLanguage = (): "ru" | "en" => {
  try {
    const data = localStorage.getItem("language");
    return (data as "ru" | "en") || "en";
  } catch {
    return "ru";
  }
};

const initialState: LanguageState = {
  currentLanguage: loadLanguage(),
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    toggleLanguage: (state) => {
      state.currentLanguage = state.currentLanguage === "ru" ? "en" : "ru";
      localStorage.setItem("language", state.currentLanguage);
    },
    setLanguage: (state, action: PayloadAction<"ru" | "en">) => {
      state.currentLanguage = action.payload;
      localStorage.setItem("language", action.payload);
    },
  },
});

export const { toggleLanguage, setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
