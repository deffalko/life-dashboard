import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import {
  addNote,
  deleteNote,
  togglePin,
  setNotesFilter,
} from "../store/slices/notesSlice";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  PlusIcon,
  TrashIcon,
  PinIcon,
  XMarkIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";

const NotesPage: React.FC = () => {
  const dispatch = useDispatch();
  const { items, filter } = useSelector((state: RootState) => state.notes);
  const [showForm, setShowForm] = useState(false);
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    tags: "",
    color: "#8b5cf6",
  });

  const colors = [
    "#8b5cf6",
    "#ec4899",
    "#f59e0b",
    "#10b981",
    "#3b82f6",
    "#ef4444",
  ];

  const filteredNotes = items
    .filter(
      (note) =>
        note.title.toLowerCase().includes(filter.search.toLowerCase()) ||
        note.content.toLowerCase().includes(filter.search.toLowerCase()),
    )
    .filter(
      (note) =>
        filter.tags.length === 0 ||
        filter.tags.some((tag) => note.tags.includes(tag)),
    )
    .sort((a, b) => (a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1));

  const handleAddNote = () => {
    if (!newNote.title.trim()) {
      toast.error("Введите заголовок заметки");
      return;
    }
    dispatch(
      addNote({
        title: newNote.title,
        content: newNote.content,
        tags: newNote.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        color: newNote.color,
        pinned: false,
      }),
    );
    setNewNote({ title: "", content: "", tags: "", color: "#8b5cf6" });
    setShowForm(false);
    toast.success("Заметка добавлена! 📝");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-purple-100 dark:border-purple-900/30">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            📝 Заметки
          </h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-indigo-600 transition shadow-lg flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            Новая заметка
          </button>
        </div>

        {/* Поиск */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="🔍 Поиск заметок..."
            value={filter.search}
            onChange={(e) =>
              dispatch(setNotesFilter({ search: e.target.value }))
            }
            className="w-full px-4 py-3 border-2 border-purple-200 dark:border-purple-700 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-300 dark:bg-gray-700 dark:text-white transition"
          />
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
                  placeholder="Заголовок..."
                  value={newNote.title}
                  onChange={(e) =>
                    setNewNote({ ...newNote, title: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-purple-200 dark:border-purple-700 rounded-xl focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                />
                <textarea
                  placeholder="Содержание (можно использовать Markdown)..."
                  value={newNote.content}
                  onChange={(e) =>
                    setNewNote({ ...newNote, content: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-purple-200 dark:border-purple-700 rounded-xl focus:border-purple-500 dark:bg-gray-700 dark:text-white resize-none"
                  rows={4}
                />
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewNote({ ...newNote, color })}
                      className={`w-8 h-8 rounded-full border-2 transition ${
                        newNote.color === color
                          ? "border-purple-500 scale-110"
                          : "border-transparent"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Теги (через запятую)..."
                  value={newNote.tags}
                  onChange={(e) =>
                    setNewNote({ ...newNote, tags: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-purple-200 dark:border-purple-700 rounded-xl focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleAddNote}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-indigo-600 transition shadow-lg"
                  >
                    Сохранить
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

        {/* Список заметок */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredNotes.map((note) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="rounded-2xl p-4 shadow-lg border border-purple-100 dark:border-purple-900/30 hover:shadow-xl transition"
                style={{ backgroundColor: note.color + "15" }}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-800 dark:text-white truncate">
                    {note.title}
                  </h3>
                  <div className="flex gap-1">
                    <button
                      onClick={() => dispatch(togglePin(note.id))}
                      className={`p-1 rounded-lg transition ${
                        note.pinned
                          ? "text-purple-500"
                          : "text-gray-400 hover:text-purple-500"
                      }`}
                    >
                      <PinIcon
                        className={`h-5 w-5 ${note.pinned ? "fill-current" : ""}`}
                      />
                    </button>
                    <button
                      onClick={() => {
                        dispatch(deleteNote(note.id));
                        toast.success("Заметка удалена");
                      }}
                      className="p-1 rounded-lg text-gray-400 hover:text-red-500 transition"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                  {note.content}
                </p>
                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {note.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                  {new Date(note.createdAt).toLocaleDateString("ru-RU")}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default NotesPage;
