import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { setTheme } from "../store/slices/themeSlice";
import { setLanguage } from "../store/slices/languageSlice";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const SettingsPage: React.FC = () => {
  const dispatch = useDispatch();
  const { darkMode } = useSelector((state: RootState) => state.theme);
  const { currentLanguage } = useSelector((state: RootState) => state.language);

  const handleExport = () => {
    const data = {
      tasks: JSON.parse(localStorage.getItem("tasks") || "[]"),
      notes: JSON.parse(localStorage.getItem("notes") || "[]"),
      favorites: JSON.parse(localStorage.getItem("weatherFavorites") || "[]"),
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `life-dashboard-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Данные экспортированы! 📦");
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.tasks)
          localStorage.setItem("tasks", JSON.stringify(data.tasks));
        if (data.notes)
          localStorage.setItem("notes", JSON.stringify(data.notes));
        if (data.favorites)
          localStorage.setItem(
            "weatherFavorites",
            JSON.stringify(data.favorites),
          );
        toast.success("Данные импортированы! 🔄");
        setTimeout(() => window.location.reload(), 1000);
      } catch {
        toast.error("Ошибка при импорте");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  const handleClearData = () => {
    if (confirm("Вы уверены, что хотите удалить все данные?")) {
      localStorage.clear();
      toast.success("Все данные удалены");
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-purple-100 dark:border-purple-900/30"
      >
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
          ⚙️ Настройки
        </h1>

        <div className="space-y-6">
          {/* Тема */}
          <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-2xl">
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-white">
                Тема оформления
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Выберите светлую или тёмную тему
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => dispatch(setTheme(false))}
                className={`px-4 py-2 rounded-xl transition ${
                  !darkMode
                    ? "bg-purple-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                }`}
              >
                ☀️ Светлая
              </button>
              <button
                onClick={() => dispatch(setTheme(true))}
                className={`px-4 py-2 rounded-xl transition ${
                  darkMode
                    ? "bg-purple-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                }`}
              >
                🌙 Тёмная
              </button>
            </div>
          </div>

          {/* Язык */}
          <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-2xl">
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-white">
                Язык интерфейса
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Выберите язык приложения
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => dispatch(setLanguage("ru"))}
                className={`px-4 py-2 rounded-xl transition ${
                  currentLanguage === "ru"
                    ? "bg-purple-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                }`}
              >
                🇷🇺 Русский
              </button>
              <button
                onClick={() => dispatch(setLanguage("en"))}
                className={`px-4 py-2 rounded-xl transition ${
                  currentLanguage === "en"
                    ? "bg-purple-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                }`}
              >
                🇬🇧 English
              </button>
            </div>
          </div>

          {/* Данные */}
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-2xl">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-3">
              Управление данными
            </h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-600 transition shadow-lg"
              >
                📤 Экспорт данных
              </button>
              <label className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-cyan-600 transition shadow-lg cursor-pointer">
                📥 Импорт данных
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
              <button
                onClick={handleClearData}
                className="px-4 py-2 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition shadow-lg"
              >
                🗑️ Очистить всё
              </button>
            </div>
          </div>

          {/* О приложении */}
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-2xl text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Life Dashboard v1.0.0 • Сделано с 💜
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Данные хранятся локально в вашем браузере
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsPage;
