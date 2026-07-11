import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useTranslation } from "../hooks/useTranslation";
import { motion } from "framer-motion";
import {
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";

const Dashboard: React.FC = () => {
  const { translate } = useTranslation();
  const tasks = useSelector((state: RootState) => state.tasks.items);
  const [greeting, setGreeting] = useState("");
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting(translate("Доброе утро 🌅"));
    else if (hour < 18) setGreeting(translate("Добрый день 🌤️"));
    else setGreeting(translate("Добрый вечер 🌙"));

    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("ru-RU", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
      setDate(
        now.toLocaleDateString("ru-RU", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [translate]);

  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const active = total - completed;
  const overdue = tasks.filter(
    (t) => !t.completed && t.deadline && new Date(t.deadline) < new Date(),
  ).length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const stats = [
    {
      label: translate("Всего задач"),
      value: total,
      icon: ClockIcon,
      color: "from-purple-500 to-indigo-500",
    },
    {
      label: translate("Выполнено"),
      value: completed,
      icon: CheckCircleIcon,
      color: "from-green-500 to-emerald-500",
    },
    {
      label: translate("В процессе"),
      value: active,
      icon: ArrowTrendingUpIcon,
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: translate("Просрочено"),
      value: overdue,
      icon: ExclamationCircleIcon,
      color: "from-red-500 to-pink-500",
    },
  ];

  const recentTasks = tasks.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Приветствие */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl shadow-xl p-6 sm:p-8 mb-6 border border-purple-100 dark:border-purple-900/30"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white">
              {greeting}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mt-1">
              {date}
            </p>
          </div>
          <div className="text-right">
            <p className="text-4xl sm:text-5xl font-light text-purple-600 dark:text-purple-400 font-mono">
              {time}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {completionRate}% {translate("задач выполнено")}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Статистика */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg p-4 sm:p-6 border border-purple-100 dark:border-purple-900/30 hover:shadow-xl transition"
          >
            <div
              className={`bg-gradient-to-r ${stat.color} rounded-2xl p-3 sm:p-4 text-white`}
            >
              <div className="flex items-center justify-between">
                <stat.icon className="h-6 w-6 sm:h-8 sm:w-8" />
                <span className="text-2xl sm:text-4xl font-bold">
                  {stat.value}
                </span>
              </div>
              <p className="text-xs sm:text-sm opacity-90 mt-1">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Последние задачи */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-purple-100 dark:border-purple-900/30"
      >
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <ClockIcon className="h-6 w-6 text-purple-500" />
          {translate("Последние задачи")}
        </h2>
        {recentTasks.length === 0 ? (
          <p className="text-gray-400 dark:text-gray-500 text-center py-8">
            ✨ {translate("Нет задач. Добавьте первую!")}
          </p>
        ) : (
          <div className="space-y-2">
            {recentTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center justify-between p-3 rounded-xl ${
                  task.completed
                    ? "bg-gray-50 dark:bg-gray-700/50 line-through text-gray-400 dark:text-gray-500"
                    : "bg-purple-50 dark:bg-purple-900/20"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      task.priority === "high"
                        ? "bg-red-500"
                        : task.priority === "medium"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                    }`}
                  />
                  <span className={task.completed ? "line-through" : ""}>
                    {task.title}
                  </span>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                  {task.category}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;
