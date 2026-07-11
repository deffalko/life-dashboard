import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Task {
  id: string;
  title: string;
  description: string;
  category: "work" | "personal" | "study";
  priority: "high" | "medium" | "low";
  completed: boolean;
  deadline: string | null;
  createdAt: string;
}

interface TasksState {
  items: Task[];
  filter: {
    category: "all" | "work" | "personal" | "study";
    status: "all" | "completed" | "active";
    search: string;
    sortBy: "createdAt" | "deadline" | "priority";
    sortOrder: "asc" | "desc";
  };
}

const loadTasks = (): Task[] => {
  try {
    const data = localStorage.getItem("tasks");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveTasks = (tasks: Task[]) => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

const initialState: TasksState = {
  items: loadTasks(),
  filter: {
    category: "all",
    status: "all",
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  },
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Omit<Task, "id" | "createdAt">>) => {
      const newTask: Task = {
        ...action.payload,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      state.items.unshift(newTask);
      saveTasks(state.items);
    },
    toggleTask: (state, action: PayloadAction<string>) => {
      const task = state.items.find((t) => t.id === action.payload);
      if (task) {
        task.completed = !task.completed;
        saveTasks(state.items);
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((t) => t.id !== action.payload);
      saveTasks(state.items);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.items.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
        saveTasks(state.items);
      }
    },
    clearCompleted: (state) => {
      state.items = state.items.filter((t) => !t.completed);
      saveTasks(state.items);
    },
    setFilter: (
      state,
      action: PayloadAction<Partial<TasksState["filter"]>>,
    ) => {
      state.filter = { ...state.filter, ...action.payload };
    },
    resetFilter: (state) => {
      state.filter = initialState.filter;
    },
  },
});

export const {
  addTask,
  toggleTask,
  deleteTask,
  updateTask,
  clearCompleted,
  setFilter,
  resetFilter,
} = tasksSlice.actions;
export default tasksSlice.reducer;
