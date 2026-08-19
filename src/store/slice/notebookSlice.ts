import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {Notebook, PageDetail} from '../../types'

interface NotebookState{
    notebooks: Notebook[];
    activeNotebook: Notebook | null;
    activePage: PageDetail | null;
    loading: boolean;
}

const initialState: NotebookState = {
    notebooks: [],
    activeNotebook: null,
    activePage: null,
    loading: false
}

const notebookSlice = createSlice({
    name: 'notebooks',
    initialState,
    reducers: {
        loadGuestNotebooks: (state, action: PayloadAction<Notebook[]>) =>{
            state.notebooks = action.payload;
        },
        setNotebooks: (state, action: PayloadAction<Notebook[]>) =>{
            state.notebooks = action.payload;
        },
        setActiveNotebook: (state, action: PayloadAction<Notebook | null>) =>{
            state.activeNotebook = action.payload;
        },
        setActivePage: (state, action: PayloadAction<PageDetail | null>) =>{
            state.activePage = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) =>{
            state.loading = action.payload;
        },
    }
});

export const {setNotebooks, setActiveNotebook, setActivePage, setLoading, loadGuestNotebooks} = notebookSlice.actions;
export default notebookSlice.reducer;