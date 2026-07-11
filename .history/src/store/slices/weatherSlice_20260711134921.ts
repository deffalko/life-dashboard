import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface WeatherData {
  city: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  forecast: Array<{
    date: string;
    temperature: number;
    description: string;
    icon: string;
  }>;
}

interface WeatherState {
  current: WeatherData | null;
  loading: boolean;
  error: string | null;
  favorites: string[];
}

const loadFavorites = (): string[] => {
  try {
    const data = localStorage.getItem("weatherFavorites");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const initialState: WeatherState = {
  current: null,
  loading: false,
  error: null,
  favorites: loadFavorites(),
};

const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    setWeather: (state, action: PayloadAction<WeatherData>) => {
      state.current = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    addFavorite: (state, action: PayloadAction<string>) => {
      if (!state.favorites.includes(action.payload)) {
        state.favorites.push(action.payload);
        localStorage.setItem(
          "weatherFavorites",
          JSON.stringify(state.favorites),
        );
      }
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.favorites = state.favorites.filter(
        (city) => city !== action.payload,
      );
      localStorage.setItem("weatherFavorites", JSON.stringify(state.favorites));
    },
  },
});

export const { setWeather, setLoading, setError, addFavorite, removeFavorite } =
  weatherSlice.actions;
export default weatherSlice.reducer;
