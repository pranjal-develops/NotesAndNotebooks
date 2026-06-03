import { createSlice } from '@reduxjs/toolkit'

// Define a type for the slice state
interface UiState {
  isSidebarOpen: boolean;
  // activeView: 'notes' | 'create-notebook' | 'notebook-content';
}

// Define the initial state using that type
const initialState: UiState = {
  isSidebarOpen: false,
  // activeView: 'notes',
}

export const uiSlice = createSlice({
  name: 'ui',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    SetSideBarOpen: (state)=>{
        state.isSidebarOpen = !state.isSidebarOpen;
    },
    // setActiveView: (state, action) => {
    //     state.activeView = action.payload;
    // }
  },
})

// export const { SetSideBarOpen, setActiveView } = uiSlice.actions
export const { SetSideBarOpen } = uiSlice.actions
export default uiSlice.reducer