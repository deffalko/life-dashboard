import React, { useEffect } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./store";
import { toggleTheme } from "./store/slices/themeSlice";
import { toggleLanguage } from "./store/slices/languageSlice";
import { useTranslation } from "./hooks/useTranslation";
import Dashboard from "./pages/Dashboard";
import TasksPage from "./pages/TasksPage";
import NotesPage from "./pages/NotesPage";
import WeatherPage from "./pages/WeatherPage";
import SettingsPage from "./pages/SettingsPage";
import {
  HomeIcon,
  ListBulletIcon,
  PencilSquareIcon,
  CloudIcon,
  Cog6ToothIcon,
  SunIcon,
  MoonIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";

const App: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { translate } = useTranslation();
  const { darkMode } = useSelector((state: RootState) => state.theme);
  const { currentLanguage } = useSelector((state: RootState) => state.language);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const navItems = [
    { path: "/", icon: HomeIcon, label: "Главная" },
    { path: "/tasks", icon: ListBulletIcon, label: "Задачи" },
    { path: "/notes", icon: PencilSquareIcon, label: "Заметки" },
    { path: "/weather", icon: CloudIcon, label: "Погода" },
    { path: "/settings", icon: Cog6ToothIcon, label: "Настройки" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-gray-900 dark:via-purple-950 dark:to-gray-900 transition-colors duration-300">
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-lg sticky top-0 z-50 border-b border-purple-100 dark:border-purple-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Life Dashboardв
              </h1>
              <div className="hidden md:flex gap-2">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                        isActive
                          ? "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400"
                          : "text-gray-600 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/30"
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="hidden lg:inline">
                        {translate(item.label as any)}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => dispatch(toggleLanguage())}
                className="flex items-center gap-1 px-3 py-2 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/30 transition text-gray-600 dark:text-gray-300"
              >
                <GlobeAltIcon className="h-5 w-5" />
                <span className="text-sm font-medium">
                  {currentLanguage.toUpperCase()}
                </span>
              </button>
              <button
                onClick={() => dispatch(toggleTheme())}
                className="p-2 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/30 transition text-gray-600 dark:text-gray-300"
              >
                {darkMode ? (
                  <SunIcon className="h-5 w-5" />
                ) : (
                  <MoonIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-purple-100 dark:border-purple-900/50 z-50">
        <div className="flex justify-around py-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center p-2 rounded-xl transition-all ${
                  isActive
                    ? "text-purple-600 dark:text-purple-400"
                    : "text-gray-400 dark:text-gray-500"
                }`}
              >
                <item.icon className="h-6 w-6" />
                <span className="text-xs mt-1">
                  {translate(item.label as any)}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="pb-20 md:pb-0">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/weather" element={<WeatherPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
