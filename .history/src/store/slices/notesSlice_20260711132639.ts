import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  color: string;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}

interface NotesState {
  items: Note[];
  filter: {
    search: string;
    tags: string[];
  };
}

const loadNotes = (): Note[] => {
  try {
    const data = localStorage.getItem("notes");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveNotes = (notes: Note[]) => {
  localStorage.setItem("notes", JSON.stringify(notes));
};

const initialState: NotesState = {
  items: loadNotes(),
  filter: {
    search: "",
    tags: [],
  },
};

const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    addNote: (
      state,
      action: PayloadAction<Omit<Note, "id" | "createdAt" | "updatedAt">>,
    ) => {
      const newNote: Note = {
        ...action.payload,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.items.unshift(newNote);
      saveNotes(state.items);
    },
    updateNote: (state, action: PayloadAction<Note>) => {
      const index = state.items.findIndex((n) => n.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = {
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
        saveNotes(state.items);
      }
    },
    deleteNote: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((n) => n.id !== action.payload);
      saveNotes(state.items);
    },
    togglePin: (state, action: PayloadAction<string>) => {
      const note = state.items.find((n) => n.id === action.payload);
      if (note) {
        note.pinned = !note.pinned;
        saveNotes(state.items);
      }
    },
    setNotesFilter: (
      state,
      action: PayloadAction<Partial<NotesState["filter"]>>,
    ) => {
      state.filter = { ...state.filter, ...action.payload };
    },
  },
});

export const { addNote, updateNote, deleteNote, togglePin, setNotesFilter } =
  notesSlice.actions;
export default notesSlice.reducer;
