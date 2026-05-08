import { createSlice } from '@reduxjs/toolkit'

// Define a type for the slice state
interface UiState {
  isSidebarOpen: boolean
}

// Define the initial state using that type
const initialState: UiState = {
  isSidebarOpen: false,
}

export const uiSlice = createSlice({
  name: 'ui',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    SetSideBarOpen: (state)=>{
        state.isSidebarOpen = !state.isSidebarOpen;
    }
  },
})

export const { SetSideBarOpen } = uiSlice.actions
export default uiSlice.reducer