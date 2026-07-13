import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Note } from '../../types'

// Define a type for the slice state
interface NoteState {
  searchText: string,
  addNote: boolean,
  notes: Note[],
  selectedTag: string | null
}

// Define the initial state using that type
const initialState: NoteState = {
  searchText: '',
  addNote: false,
  notes: [],
  selectedTag: null
}

export const noteSlice = createSlice({
  name: 'note',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setSearchText: (state, action:PayloadAction<string>)=>{
        state.searchText = action.payload;
    },
    setAddNote: (state)=>{
      state.addNote = !state.addNote;
    },
    AddNoteTrue: (state)=>{
      state.addNote = true;
    },
    AddNoteFalse: (state)=>{
      state.addNote = false;
    },
    setNotes: (state, action:PayloadAction<Note[]>)=>{
      state.notes = action.payload;
    },
    addOptimisticNote: (state, action: PayloadAction<Note>) => {
  state.notes.unshift(action.payload); // Immer lets you use "push/unshift" safely!
},
    setSelectedTag: (state, action: PayloadAction<string | null>) => {
            state.selectedTag = action.payload;
        },
  }
})

export const { setSearchText, setAddNote, AddNoteTrue, AddNoteFalse, setNotes, setSelectedTag } = noteSlice.actions
export default noteSlice.reducer