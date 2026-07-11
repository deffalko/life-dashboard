import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import {
  setWeather,
  setLoading,
  setError,
  addFavorite,
  removeFavorite,
} from "../store/slices/weatherSlice";
import toast from "react-hot-toast";
import axios from "axios";
import {
  MagnifyingGlassIcon,
  HeartIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

// Мок-данные для автономной работы
const mockWeatherData = (city: string) => ({
  city: city || "Москва",
  temperature: 22,
  feelsLike: 20,
  humidity: 65,
  windSpeed: 12,
  description: "Облачно с прояснениями",
  icon: "https://openweathermap.org/img/wn/04d@2x.png",
  forecast: [
    {
      date: new Date(Date.now() + 86400000).toISOString(),
      temperature: 23,
      description: "Переменная облачность",
      icon: "https://openweathermap.org/img/wn/03d.png",
    },
    {
      date: new Date(Date.now() + 172800000).toISOString(),
      temperature: 20,
      description: "Небольшой дождь",
      icon: "https://openweathermap.org/img/wn/10d.png",
    },
    {
      date: new Date(Date.now() + 259200000).toISOString(),
      temperature: 18,
      description: "Пасмурно",
      icon: "https://openweathermap.org/img/wn/04d.png",
    },
    {
      date: new Date(Date.now() + 345600000).toISOString(),
      temperature: 25,
      description: "Ясно",
      icon: "https://openweathermap.org/img/wn/01d.png",
    },
    {
      date: new Date(Date.now() + 432000000).toISOString(),
      temperature: 27,
      description: "Солнечно",
      icon: "https://openweathermap.org/img/wn/01d.png",
    },
  ],
});

const WeatherPage: React.FC = () => {
  const dispatch = useDispatch();
  const { current, loading, error, favorites } = useSelector(
    (state: RootState) => state.weather,
  );
  const [city, setCity] = useState("");
  const [searchCity, setSearchCity] = useState("");

  const fetchWeather = async (cityName: string) => {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

    if (!apiKey) {
      // Если нет ключа — используем мок
      dispatch(setWeather(mockWeatherData(cityName)));
      toast.info("Используются демо-данные (нет API ключа)");
      return;
    }

    try {
      dispatch(setLoading(true));

      // Прокси для обхода блокировки
      const proxy = "https://cors-anywhere.herokuapp.com/";
      const baseUrl = "https://api.openweathermap.org/data/2.5";

      // Запрос текущей погоды через прокси
      const response = await axios.get(
        `${proxy}${baseUrl}/weather?q=${cityName}&appid=${apiKey}&units=metric&lang=ru`,
        { timeout: 10000 }, // таймаут 10 секунд
      );

      const data = response.data;

      // Запрос прогноза через прокси
      const forecastResponse = await axios.get(
        `${proxy}${baseUrl}/forecast?q=${cityName}&appid=${apiKey}&units=metric&lang=ru&cnt=5`,
        { timeout: 10000 },
      );

      const weatherData = {
        city: data.name,
        temperature: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6),
        description: data.weather[0].description,
        icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
        forecast: forecastResponse.data.list.map((item: any) => ({
          date: item.dt_txt,
          temperature: Math.round(item.main.temp),
          description: item.weather[0].description,
          icon: `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`,
        })),
      };

      dispatch(setWeather(weatherData));
      setCity(cityName);
    } catch (error) {
      console.error("Ошибка загрузки погоды:", error);

      // При ошибке используем мок-данные
      dispatch(setWeather(mockWeatherData(cityName)));
      toast.error("Не удалось загрузить погоду, используются демо-данные");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCity.trim()) {
      fetchWeather(searchCity.trim());
      setSearchCity("");
    }
  };

  const toggleFavorite = () => {
    if (!current) return;
    if (favorites.includes(current.city)) {
      dispatch(removeFavorite(current.city));
      toast.success(`${current.city} удален из избранного`);
    } else {
      dispatch(addFavorite(current.city));
      toast.success(`${current.city} добавлен в избранное`);
    }
  };

  // Загрузка при старте
  useEffect(() => {
    if (!current && !error) {
      fetchWeather("Moscow");
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!current) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Основная погода */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-purple-100 dark:border-purple-900/30">
            <form onSubmit={handleSearch} className="flex gap-2 mb-6">
              <input
                type="text"
                placeholder="Введите город..."
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="flex-1 px-4 py-3 border-2 border-purple-200 dark:border-purple-700 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-300 dark:bg-gray-700 dark:text-white transition"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-indigo-600 transition shadow-lg flex items-center gap-2"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
                Найти
              </button>
            </form>

            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                  {current.city}
                  <button
                    onClick={toggleFavorite}
                    className="hover:scale-110 transition"
                  >
                    <HeartIcon
                      className={`h-6 w-6 ${favorites.includes(current.city) ? "text-red-500 fill-current" : "text-gray-400"}`}
                    />
                  </button>
                </h2>
                <p className="text-6xl font-bold text-purple-600 dark:text-purple-400 mt-2">
                  {current.temperature}°C
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-300 mt-1">
                  {current.description}
                </p>
                <div className="flex gap-4 mt-4 text-gray-600 dark:text-gray-300 flex-wrap">
                  <span>🌡️ Ощущается: {current.feelsLike}°C</span>
                  <span>💧 Влажность: {current.humidity}%</span>
                  <span>💨 Ветер: {current.windSpeed} км/ч</span>
                </div>
              </div>
              <img
                src={current.icon}
                alt={current.description}
                className="w-24 h-24"
              />
            </div>
          </div>
        </div>

        {/* Избранное и прогноз */}
        <div>
          <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-purple-100 dark:border-purple-900/30">
            <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <HeartIcon className="h-5 w-5 text-red-500" />
              Избранное
            </h3>
            {favorites.length === 0 ? (
              <p className="text-gray-400 dark:text-gray-500 text-sm">
                Нет избранных городов
              </p>
            ) : (
              <div className="space-y-2">
                {favorites.map((city) => (
                  <button
                    key={city}
                    onClick={() => fetchWeather(city)}
                    className="w-full text-left px-4 py-3 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/30 transition flex items-center justify-between"
                  >
                    <span className="text-gray-700 dark:text-gray-300">
                      {city}
                    </span>
                    <MapPinIcon className="h-4 w-4 text-purple-500" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Прогноз */}
          {current.forecast && (
            <div className="mt-4 bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-purple-100 dark:border-purple-900/30">
              <h3 className="font-bold text-gray-800 dark:text-white mb-4">
                📅 Прогноз
              </h3>
              <div className="space-y-3">
                {current.forecast.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-xl transition"
                  >
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {new Date(item.date).toLocaleDateString("ru-RU", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {item.description}
                    </span>
                    <span className="font-bold text-purple-600 dark:text-purple-400">
                      {item.temperature}°C
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeatherPage;
