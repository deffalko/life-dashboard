import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import {
  addTask,
  toggleTask,
  deleteTask,
  clearCompleted,
  setFilter,
  resetFilter,
} from "../store/slices/tasksSlice";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  PlusIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  FunnelIcon,
  XCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

const TasksPage: React.FC = () => {
  const dispatch = useDispatch();
  const { items, filter } = useSelector((state: RootState) => state.tasks);
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    category: "personal" as const,
    priority: "medium" as const,
    deadline: "",
  });

  const filteredTasks = items
    .filter((task) => {
      if (filter.status === "completed") return task.completed;
      if (filter.status === "active") return !task.completed;
      return true;
    })
    .filter(
      (task) => filter.category === "all" || task.category === filter.category,
    )
    .filter((task) =>
      task.title.toLowerCase().includes(filter.search.toLowerCase()),
    )
    .sort((a, b) => {
      if (filter.sortBy === "createdAt") {
        return filter.sortOrder === "desc"
          ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (filter.sortBy === "deadline") {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return filter.sortOrder === "desc"
          ? new Date(b.deadline).getTime() - new Date(a.deadline).getTime()
          : new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      if (filter.sortBy === "priority") {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return filter.sortOrder === "desc"
          ? priorityOrder[b.priority] - priorityOrder[a.priority]
          : priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return 0;
    });

  const stats = {
    total: items.length,
    completed: items.filter((t) => t.completed).length,
    active: items.filter((t) => !t.completed).length,
    overdue: items.filter(
      (t) => !t.completed && t.deadline && new Date(t.deadline) < new Date(),
    ).length,
  };

  const handleAddTask = () => {
    if (!newTask.title.trim()) {
      toast.error("Введите название задачи");
      return;
    }
    dispatch(
      addTask({
        ...newTask,
        deadline: newTask.deadline || null,
        completed: false, // <-- ДОБАВЬТЕ ЭТУ СТРОКУ
      }),
    );
    setNewTask({
      title: "",
      description: "",
      category: "personal",
      priority: "medium",
      deadline: "",
    });
    setShowForm(false);
    toast.success("Задача добавлена! 🎉");
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400";
      case "medium":
        return "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "low":
        return "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400";
    }
  };

  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case "work":
        return "💼";
      case "personal":
        return "🧘";
      case "study":
        return "📚";
      default:
        return "📌";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Левая колонка - статистика и фильтры */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-purple-100 dark:border-purple-900/30">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
              📊 Статистика
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-900/30 rounded-xl">
                <span className="text-gray-600 dark:text-gray-300">Всего</span>
                <span className="font-bold text-purple-600 dark:text-purple-400 text-xl">
                  {stats.total}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/30 rounded-xl">
                <span className="text-gray-600 dark:text-gray-300">
                  ✅ Выполнено
                </span>
                <span className="font-bold text-green-600 dark:text-green-400 text-xl">
                  {stats.completed}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
                <span className="text-gray-600 dark:text-gray-300">
                  ⏳ Активные
                </span>
                <span className="font-bold text-blue-600 dark:text-blue-400 text-xl">
                  {stats.active}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/30 rounded-xl">
                <span className="text-gray-600 dark:text-gray-300">
                  ⚠️ Просрочено
                </span>
                <span className="font-bold text-red-600 dark:text-red-400 text-xl">
                  {stats.overdue}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-purple-100 dark:border-purple-900/30">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <FunnelIcon className="h-5 w-5 text-purple-500" />
              Фильтры
            </h3>
            <div className="space-y-2">
              {[
                { label: "Все задачи", value: "all" },
                { label: "Активные", value: "active" },
                { label: "Выполненные", value: "completed" },
              ].map((status) => (
                <button
                  key={status.value}
                  onClick={() =>
                    dispatch(setFilter({ status: status.value as any }))
                  }
                  className={`w-full text-left px-3 py-2 rounded-xl transition ${
                    filter.status === status.value
                      ? "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-300"
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
            <hr className="my-3 border-purple-100 dark:border-purple-900/30" />
            <div className="space-y-2">
              {[
                { label: "Все категории", value: "all" },
                { label: "💼 Работа", value: "work" },
                { label: "🧘 Личное", value: "personal" },
                { label: "📚 Учеба", value: "study" },
              ].map((category) => (
                <button
                  key={category.value}
                  onClick={() =>
                    dispatch(setFilter({ category: category.value as any }))
                  }
                  className={`w-full text-left px-3 py-2 rounded-xl transition ${
                    filter.category === category.value
                      ? "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-300"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => dispatch(resetFilter())}
              className="w-full mt-3 px-3 py-2 text-sm text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-xl transition flex items-center justify-center gap-2"
            >
              <ArrowPathIcon className="h-4 w-4" />
              Сбросить фильтры
            </button>
          </div>

          <button
            onClick={() => dispatch(clearCompleted())}
            className="w-full px-4 py-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-2xl hover:bg-red-100 dark:hover:bg-red-900/50 transition font-medium flex items-center justify-center gap-2"
          >
            <XCircleIcon className="h-5 w-5" />
            Очистить выполненные
          </button>
        </div>

        {/* Правая колонка - задачи */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-purple-100 dark:border-purple-900/30">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                📋 Мои задачи
              </h1>
              <button
                onClick={() => setShowForm(!showForm)}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-indigo-600 transition shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <PlusIcon className="h-5 w-5" />
                Новая задача
              </button>
            </div>

            {/* Форма добавления */}
            <AnimatePresence>
              {showForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 overflow-hidden"
                >
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-4 space-y-4">
                    <input
                      type="text"
                      placeholder="Название задачи..."
                      value={newTask.title}
                      onChange={(e) =>
                        setNewTask({ ...newTask, title: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-purple-200 dark:border-purple-700 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-300 dark:bg-gray-700 dark:text-white transition"
                    />
                    <textarea
                      placeholder="Описание..."
                      value={newTask.description}
                      onChange={(e) =>
                        setNewTask({ ...newTask, description: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-purple-200 dark:border-purple-700 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-300 dark:bg-gray-700 dark:text-white transition resize-none"
                      rows={2}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <select
                        value={newTask.category}
                        onChange={(e) =>
                          setNewTask({
                            ...newTask,
                            category: e.target.value as any,
                          })
                        }
                        className="px-4 py-3 border-2 border-purple-200 dark:border-purple-700 rounded-xl focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="work">💼 Работа</option>
                        <option value="personal">🧘 Личное</option>
                        <option value="study">📚 Учеба</option>
                      </select>
                      <select
                        value={newTask.priority}
                        onChange={(e) =>
                          setNewTask({
                            ...newTask,
                            priority: e.target.value as any,
                          })
                        }
                        className="px-4 py-3 border-2 border-purple-200 dark:border-purple-700 rounded-xl focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="high">🔴 Высокий</option>
                        <option value="medium">🟡 Средний</option>
                        <option value="low">🟢 Низкий</option>
                      </select>
                      <input
                        type="date"
                        value={newTask.deadline}
                        onChange={(e) =>
                          setNewTask({ ...newTask, deadline: e.target.value })
                        }
                        className="px-4 py-3 border-2 border-purple-200 dark:border-purple-700 rounded-xl focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={handleAddTask}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-indigo-600 transition shadow-lg"
                      >
                        Добавить
                      </button>
                      <button
                        onClick={() => setShowForm(false)}
                        className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                      >
                        Отмена
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Поиск */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="🔍 Поиск задач..."
                value={filter.search}
                onChange={(e) =>
                  dispatch(setFilter({ search: e.target.value }))
                }
                className="w-full px-4 py-3 border-2 border-purple-200 dark:border-purple-700 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-300 dark:bg-gray-700 dark:text-white transition"
              />
            </div>

            {/* Список задач */}
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence>
                {filteredTasks.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <p className="text-4xl mb-4">✨</p>
                    <p className="text-gray-400 dark:text-gray-500">
                      Нет задач. Добавьте первую!
                    </p>
                  </motion.div>
                ) : (
                  filteredTasks.map((task) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className={`p-4 rounded-2xl border-2 transition-all ${
                        task.completed
                          ? "bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600 opacity-70"
                          : "bg-white dark:bg-gray-700/50 border-purple-200 dark:border-purple-600 hover:shadow-lg"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <button
                            onClick={() => dispatch(toggleTask(task.id))}
                            className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition flex-shrink-0 ${
                              task.completed
                                ? "bg-purple-500 border-purple-500 text-white"
                                : "border-gray-300 dark:border-gray-500 hover:border-purple-500"
                            }`}
                          >
                            {task.completed && (
                              <CheckIcon className="h-4 w-4" />
                            )}
                          </button>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`font-semibold truncate ${task.completed ? "line-through text-gray-400 dark:text-gray-400" : "text-gray-800 dark:text-white"}`}
                            >
                              {task.title}
                            </p>
                            {task.description && (
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 break-words">
                                {task.description}
                              </p>
                            )}
                            <div className="flex flex-wrap gap-2 mt-2">
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}
                              >
                                {task.priority === "high"
                                  ? "🔴"
                                  : task.priority === "medium"
                                    ? "🟡"
                                    : "🟢"}{" "}
                                {task.priority}
                              </span>
                              <span
                                className={`text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300`}
                              >
                                {getCategoryEmoji(task.category)}{" "}
                                {task.category}
                              </span>
                              {task.deadline && (
                                <span
                                  className={`text-xs px-2 py-1 rounded-full ${
                                    new Date(task.deadline) < new Date() &&
                                    !task.completed
                                      ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                                      : "bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300"
                                  }`}
                                >
                                  📅{" "}
                                  {new Date(task.deadline).toLocaleDateString(
                                    "ru-RU",
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            dispatch(deleteTask(task.id));
                            toast.success("Задача удалена");
                          }}
                          className="text-gray-400 hover:text-red-500 transition p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl flex-shrink-0"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasksPage;
