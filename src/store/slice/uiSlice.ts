import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

// Define a type for the slice state
interface UiState {
  isSidebarOpen: boolean;
  tempAccentColor: string | null;
  sidebarType: 'notes' | 'notebooks' | 'drawings' | null
  // activeView: 'notes' | 'create-notebook' | 'notebook-content';
}

// Define the initial state using that type
const initialState: UiState = {
  isSidebarOpen: false,
  tempAccentColor: null,
  sidebarType: 'notes',
  // activeView: 'notes',
}

export const uiSlice = createSlice({
  name: 'ui',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    SetSideBarOpen: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    SetTempAccentColor: (state, action: PayloadAction<string | null>) => {
      state.tempAccentColor = action.payload;
    },
    SetSidebarType: (state, action: PayloadAction<'notes' | 'notebooks' | 'drawings' | null>) => {
      state.sidebarType = action.payload;
    },
    // setActiveView: (state, action) => {
    //     state.activeView = action.payload;
    // }
  },
})

// export const { SetSideBarOpen, setActiveView } = uiSlice.actions
export const { SetSideBarOpen, SetTempAccentColor, SetSidebarType } = uiSlice.actions
export default uiSlice.reducer