import { configureStore } from '@reduxjs/toolkit'
import noteReducer from './slice/noteSlice'
import notebookReducer from './slice/notebookSlice'
import uiReducer from './slice/uiSlice'
import authReducer from './slice/authSlice'

export const store = configureStore({
  reducer: {
    note: noteReducer,
    ui: uiReducer,
    notebook: notebookReducer,
    auth: authReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch