import { useState, useEffect } from "react";
import EditPopup from "../Components/EditPopUp";
import Navbar from "../Components/Navbar";
import axios from "axios";
import Add from "../Components/Add";
import DrawingCanvas from "../Components/Canvas";
import Sidebar from "../Components/Sidebar";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import Notes from "../Components/Notes";
import type { Note as note } from "../types";
import AddButton from "../Components/AddButton";

function Home() {
  const { searchText, addNote } = useSelector((state: RootState) => state.note);

  const [notes, setnotes] = useState<note[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [editingnote, setEditingnote] = useState<note | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:8080/api/notes", {
          params: {
            q: searchText,
          },
        });
        setnotes(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [addNote, searchText]);

  const handleUpdate = (updatednote: note) => {
    setnotes(
      notes.map((note) => (note.id === updatednote.id ? updatednote : note)),
    );
  };

  const handleDelete = async (id: number) => {
    const previousNotes = [...notes];
    setnotes(notes.filter((note) => note.id !== id)); // Remove the deleted note from the state
    try {
      await axios.delete(`http://localhost:8080/api/notes/${id}`);
    } catch (error) {
      console.log("Delete failed reverting UI",error);
      setnotes(previousNotes);
    }
  };

  const handleOptimisticAdd = (noteData: note, meta?: { tempId?: number; shouldRemove?: boolean }) => {
  if (meta?.shouldRemove) {
    setnotes(prev => prev.filter(n => n.id !== noteData.id));
  } else if (meta?.tempId) {
    setnotes(prev => prev.map(n => n.id === meta.tempId ? noteData : n));
  } else {
    setnotes(prev => [noteData, ...prev]);
  }
};

  return (
    <>
      <div className="flex flex-col h-screen w-full bg-[hsl(0,0%,90%)] text-gray-900 dark:bg-black dark:text-gray-100 transition-colors duration-500">
        <Navbar />
        {/* <main className="flex-1 overflow-y-auto px-4 py-8 sm:px-6 lg:px-8"> */}
        <div className="flex overflow-hidden h-full">
          <Sidebar />
          <main className="relative flex-1 w-auto h-full overflow-y-auto p-3 md:p-6 md:mr-2 md:mb-2 bg-[hsl(0,0%,95%)] dark:bg-[hsl(0,0%,5%)] md:rounded-3xl ">
            {/* <div className="max-w-7xl mx-auto h-full"> */}
            {/* <div className=" p-3 bg-[hsl(0,0%,95%)] rounded-3xl w-full mx-auto h-full"> */}
            {/* <div className=" p-3 bg-[hsl(0,0%,95%)] dark:bg-[hsl(0,0%,5%)] rounded-l-3xl w-full h-full"> */}
            <Notes
              notes={notes}
              loading={loading}
              setEditingnote={setEditingnote}
            />
            {/* <DrawingCanvas /> */}
            <AddButton/>
            {/* </div> */}
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
