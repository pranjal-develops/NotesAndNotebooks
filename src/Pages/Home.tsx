import { useState, useEffect, useMemo, useCallback } from "react";
import EditPopup from "../Components/EditPopUp";
import Navbar from "../Components/Navbar";
import axios from "axios";
import Add from "../Components/Add";
import Sidebar from "../Components/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import type { Note as note } from "../types";
import { setNotes } from "../store/slice/noteSlice";
import { Outlet } from "react-router-dom";

const MIN_SIDEBAR_WIDTH = 240;
const MAX_SIDEBAR_WIDTH = 480;

function Home() {
  const { searchText, addNote, notes, selectedTag } = useSelector((state: RootState) => state.note);
  const { activeNotebook } = useSelector((state: RootState) => state.notebook);
  const { isSidebarOpen } = useSelector((state: RootState) => state.ui);
  const dispatch = useDispatch();

  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem("sidebarWidth");
    return saved ? parseInt(saved) : 288;
  });
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      let newWidth = e.clientX - 8; // Adjust for margin
      if (newWidth < MIN_SIDEBAR_WIDTH) newWidth = MIN_SIDEBAR_WIDTH;
      if (newWidth > MAX_SIDEBAR_WIDTH) newWidth = MAX_SIDEBAR_WIDTH;

      setSidebarWidth(newWidth);
      document.body.style.cursor = 'col-resize';
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      localStorage.setItem("sidebarWidth", sidebarWidth.toString());
      document.body.style.cursor = 'default';
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, sidebarWidth]);

  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const accentColor = useMemo(() => {
    return activeNotebook?.color || '#8b5cf6';
  }, [activeNotebook]);

  // const [notes, setnotes] = useState<note[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [editingnote, setEditingnote] = useState<note | null>(null);
  const [debouncedSearchText, setDebouncedSearchText] = useState(searchText);

  //  Effect for Debouncing
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchText]);


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE}/notes`, {
          params: {
            q: debouncedSearchText,
            tag: selectedTag,
          },
        });
        dispatch(setNotes(response.data));
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [addNote, debouncedSearchText, selectedTag]);

  // Hybrid Local Filtering for "Instant" feel
  const filteredNotes = notes.filter(note => {
    const searchLower = searchText.toLowerCase();
    // Safely check title and description, defaulting to empty string if null
    const titleMatch = (note.title ?? "").toLowerCase().includes(searchLower);
    const descMatch = (note.description ?? "").toLowerCase().includes(searchLower);

    const tagMatch = !selectedTag || (note.tags ?? []).includes(selectedTag);

    return (titleMatch || descMatch) && tagMatch;
  });

  const handleUpdate = (updatednote: note) => {
    dispatch(setNotes(
      notes.map((note) => (note.id === updatednote.id ? updatednote : note)),
    ));
  };

  const handleDelete = async (id: number) => {
    const previousNotes = [...notes];
    dispatch(setNotes(notes.filter((note) => note.id !== id))); // Remove the deleted note from the state
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE}/notes/${id}`);
    } catch (error) {
      console.log("Delete failed reverting UI", error);
      dispatch(setNotes(previousNotes));
    }
  };

  const handleOptimisticAdd = (noteData: note, meta?: { tempId?: number; shouldRemove?: boolean }) => {
    if (meta?.shouldRemove) {
      const updatedNotes = notes.filter(n => n.id !== noteData.id);
      dispatch(setNotes(updatedNotes));
    } else if (meta?.tempId) {
      const updatedNotes = notes.map(n => n.id === meta.tempId ? noteData : n);
      dispatch(setNotes(updatedNotes));
    } else {
      dispatch(setNotes([noteData, ...notes]));
    }
  };

  return (
    <>
      <div
        className="flex flex-col h-screen w-full bg-white dark:bg-[hsl(0,0%,5%)] md:bg-[hsl(0,0%,95%)] text-gray-900 md:dark:bg-black dark:text-gray-100 transition-colors duration-500"
        style={{
          '--accent-color': accentColor,
          '--accent-color-light': `${accentColor}15`,
        } as React.CSSProperties}
      >
        <Navbar />
        {/* <main className="flex-1 overflow-y-auto px-4 py-8 sm:px-6 lg:px-8"> */}
        <div className="flex overflow-hidden h-full md:pb-2 md:px-2">
          <Sidebar width={sidebarWidth} />

          {/* Resize Handle */}
          {isSidebarOpen && (
            <div
              onMouseDown={startResizing}
              className={`hidden md:block w-1.5 h-full cursor-col-resize hover:bg-(--accent-color)/30 transition-colors z-30 group relative -ml-1.5 ${isResizing ? 'bg-(--accent-color)/50' : ''}`}
            >
            </div>
          )}

          <main className={`relative flex-1 justify-center items-center w-auto h-full overflow-y-auto p-3 md:p-6 bg-white dark:bg-[hsl(0,0%,5%)] md:rounded-3xl ${isResizing ? 'select-none pointer-events-none' : ''}`}>
            {/* <main className="relative flex-1 w-auto h-full overflow-y-auto p-3 md:p-6 md:mr-2 md:mb-2 bg-[hsl(0,0%,95%)] dark:bg-[hsl(0,0%,5%)] md:rounded-3xl "> */}
            {/* {activeView === 'notes' && (
              <Notes
                notes={filteredNotes} 
                loading={loading}
                setEditingnote={setEditingnote}
              />
            )}
            {activeView === 'create-notebook' && <CreateNotebook />}
            {activeView === 'notebook-content' && (
              <div className="text-center py-5">
            {activeView === 'notebook-content' && <PageView />} */}
            {/* <p className="text-gray-500">We'll build the professional editor here next!</p> */}
            {/* </div> */}
            {/* )} */}
            <Outlet
              context={{
                notes: filteredNotes,
                loading,
                setEditingnote
              }}
            />
          </main>
        </div>
      </div>
      {/* Render the edit popup if there's a note to edit */}
      {editingnote && (
        <EditPopup
          note={editingnote}
          onClose={() => setEditingnote(null)}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}
      {addNote && <Add onAdd={handleOptimisticAdd} />}
    </>
  );
}

export default Home;
