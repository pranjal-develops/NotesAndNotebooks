import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

// Define a type for the slice state
interface NoteState {
  searchText: string,
  addNote: boolean
}

// Define the initial state using that type
const initialState: NoteState = {
  searchText: '',
  addNote: false
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
    }
  },
})

export const { setSearchText, setAddNote, AddNoteTrue, AddNoteFalse } = noteSlice.actions
export default noteSlice.reducer