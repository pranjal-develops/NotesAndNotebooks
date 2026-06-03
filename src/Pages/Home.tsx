import { useState, useEffect } from "react";
import EditPopup from "../Components/EditPopUp";
import Navbar from "../Components/Navbar";
import axios from "axios";
import Add from "../Components/Add";
import Sidebar from "../Components/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import type { Note as note } from "../types";
import AddButton from "../Components/AddButton";
import { setNotes } from "../store/slice/noteSlice";
import {Outlet} from "react-router-dom";

function Home() {
  const { searchText, addNote, notes, selectedTag } = useSelector((state: RootState) => state.note);
  const dispatch = useDispatch();

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
        const response = await axios.get("http://localhost:8080/api/notes", {
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
      await axios.delete(`http://localhost:8080/api/notes/${id}`);
    } catch (error) {
      console.log("Delete failed reverting UI",error);
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
      <div className="flex flex-col h-screen w-full bg-[hsl(0,0%,95%)] dark:bg-[hsl(0,0%,5%)] md:bg-[hsl(0,0%,90%)] text-gray-900 md:dark:bg-black dark:text-gray-100 transition-colors duration-500">
        <Navbar />
        {/* <main className="flex-1 overflow-y-auto px-4 py-8 sm:px-6 lg:px-8"> */}
        <div className="flex overflow-hidden h-full">
          <Sidebar />
          <main className="relative flex-1 w-auto h-full overflow-y-auto p-3 md:p-6 md:mr-2 md:mb-2 bg-[hsl(0,0%,95%)] dark:bg-[hsl(0,0%,5%)] md:rounded-3xl ">
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
            <AddButton/>
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
