import { configureStore } from '@reduxjs/toolkit'
import noteReducer from './slice/noteSlice'
import notebookReducer from './slice/notebookSlice'
import uiReducer from './slice/uiSlice'

export const store = configureStore({
  reducer: {
    note: noteReducer,
    ui: uiReducer,
    notebook: notebookReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch