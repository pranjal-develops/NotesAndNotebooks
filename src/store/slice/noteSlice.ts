import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Note } from '../../types'

// Define a type for the slice state
interface NoteState {
  searchText: string,
  addNote: boolean,
  addDrawing: boolean,
  notes: Note[],
  selectedTag: string | null,
  notesLoading: boolean,
  viewingDrawings: boolean
}

// Define the initial state using that type
const initialState: NoteState = {
  searchText: '',
  addNote: false,
  addDrawing: false,
  notes: [],
  selectedTag: null,
  notesLoading: false,
  viewingDrawings: false
}

export const noteSlice = createSlice({
  name: 'note',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setSearchText: (state, action: PayloadAction<string>) => {
      state.searchText = action.payload;
    },
    setAddNote: (state) => {
      state.addNote = !state.addNote;
    },
    AddNoteTrue: (state) => {
      state.addNote = true;
    },
    AddNoteFalse: (state) => {
      state.addNote = false;
    },
    AddDrawingTrue: (state) => {
      state.addDrawing = true;
    },
    AddDrawingFalse: (state) => {
      state.addDrawing = false;
    },
    setNotes: (state, action: PayloadAction<Note[]>) => {
      state.notes = action.payload;
    },
    addOptimisticNote: (state, action: PayloadAction<Note>) => {
      state.notes.unshift(action.payload); // Immer lets you use "push/unshift" safely!
    },
    resolveOptimisticNote: (state, action: PayloadAction<{ tempId: number; note: Note }>) => {
      const index = state.notes.findIndex((n) => n.id === action.payload.tempId);
      if (index !== -1) {
        state.notes[index] = action.payload.note;
      }
    },
    deleteNoteOptimistic: (state, action: PayloadAction<number>) => {
      state.notes = state.notes.filter((n) => n.id !== action.payload);
    },
    updateNoteOptimistic: (state, action: PayloadAction<Note>) => {
      const index = state.notes.findIndex((n) => n.id === action.payload.id);
      if (index !== -1) {
        state.notes[index] = action.payload;
      }
    },

    NotesLoadingTrue: (state) => {
      state.notesLoading = true;
    },
    NotesLoadingFalse: (state) => {
      state.notesLoading = false;
    },
    setSelectedTag: (state, action: PayloadAction<string | null>) => {
      state.selectedTag = action.payload;
    },
    setViewingDrawings: (state, action: PayloadAction<boolean>) => {
      state.viewingDrawings = action.payload;
    },
    toggleViewingDrawings: (state) => {
      state.viewingDrawings = !state.viewingDrawings;
    }
  }
})

export const {
  setSearchText,
  setAddNote,
  AddNoteTrue,
  AddNoteFalse,
  AddDrawingTrue,
  AddDrawingFalse,
  setNotes,
  setSelectedTag,
  NotesLoadingFalse,
  NotesLoadingTrue,
  setViewingDrawings,
  toggleViewingDrawings,
  addOptimisticNote,
  resolveOptimisticNote,
  deleteNoteOptimistic,
  updateNoteOptimistic
} = noteSlice.actions;

export default noteSlice.reducer