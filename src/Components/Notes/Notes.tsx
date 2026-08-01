import { useState } from 'react'
import Note from './Note';
import type { Note as note } from '../../types';
import { BsJournalText } from 'react-icons/bs';
import type { RootState } from '../../store/store';
import { useSelector } from 'react-redux';
import AddButton from './AddButton';
import EditPopup from './EditPopUp';
import Add from './Add';
import CreateDrawing from './CreateDrawing';
import NoteSkeleton from '../ui/NotesSkeleton';
import { useNotesFetch } from '../../hooks/useNotesFetch';

const Notes = () => {
  const { addNote, addDrawing, notesLoading } = useSelector((state: RootState) => state.note);
  // const { notes, notesLoading } = useOutletContext<HomeContext>();
  const {filteredNotes} = useNotesFetch();
  const { isSidebarOpen, sidebarType } = useSelector((state: RootState) => state.ui);
  const [editingnote, setEditingnote] = useState<note | null>(null);
  const pinnedNotes = filteredNotes.filter(n => n.pinned);
  const otherNotes = filteredNotes.filter(n => !n.pinned);

  // if (notesLoading) {
  //   return (
  //     <div
  //       className={`columns-1 sm:columns-2 gap-4 space-y-4 ${(isSidebarOpen || sidebarType)
  //           ? 'lg:columns-3 xl:columns-4 2xl:columns-5'
  //           : 'lg:columns-4 xl:columns-5 2xl:columns-6'
  //         }`}
  //     >
  //       {Array.from({ length: 8 }).map((_, index) => (
  //         <div key={index} className="break-inside-avoid">
  //           <NoteSkeleton />
  //         </div>
  //       ))}
  //     </div>
  //   );
  // }

  const renderNoteList = (noteList: note[], title?: string) => (
    <div className="mb-8">
      {title && <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4 ml-4">{title}</h3>}
      <div className={`columns-1 sm:columns-2 gap-4 space-y-4 ${(isSidebarOpen || sidebarType) ? "lg:columns-3 xl:columns-4 2xl:columns-5" : "lg:columns-4 xl:columns-5 2xl:columns-6"}`}>
        {noteList.map((note) => (
          <div key={note.id} className="break-inside-avoid">
            <Note note={note} onClk={() => setEditingnote(note)} />
          </div>
        ))}
      </div>
    </div>
  );

  return <>
{ notesLoading ? (
<div
        className={`columns-1 sm:columns-2 gap-4 space-y-4 ${(isSidebarOpen || sidebarType)
            ? 'lg:columns-3 xl:columns-4 2xl:columns-5'
            : 'lg:columns-4 xl:columns-5 2xl:columns-6'
          }`}
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="break-inside-avoid">
            <NoteSkeleton />
          </div>
        ))}
      </div>
):
(<>
      {filteredNotes.length === 0 && !notesLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 mb-6 bg-zinc-200 dark:bg-zinc-800 dark-island:bg-zinc-800 rounded-full flex items-center justify-center">
            <BsJournalText size={50} className="text-zinc-400" />
          </div>
          <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 dark-island:text-zinc-100">Your ideas start here</p>
          <p className="text-sm text-zinc-500 mt-1">Tap the plus button to capture a thought.</p>
        </div>
      ) : (
        // <div className="max-w-[1600px] mx-auto px-4">
        <div className="flex flex-col w-full justify-center px-10">
          {pinnedNotes.length > 0 && renderNoteList(pinnedNotes, "Pinned")}
          {pinnedNotes.length > 0 && otherNotes.length > 0 && <div className="h-px bg-zinc-200 dark:bg-zinc-800 dark-island:bg-zinc-800 my-8" />}
          {renderNoteList(otherNotes, pinnedNotes.length > 0 ? "Others" : undefined)}
        </div>
      )}
      <AddButton />
      {editingnote && (
        editingnote.drawing ? (
          <CreateDrawing
            note={editingnote}
            onClose={() => setEditingnote(null)}
            onToggleDrawing={(val) => setEditingnote({ ...editingnote, drawing: val })}
          />
        ) : (
          <EditPopup
            note={editingnote}
            onClose={() => setEditingnote(null)}
            onToggleDrawing={(val) => setEditingnote({ ...editingnote, drawing: val })}
          />
        )
      )}

      {addNote && <Add />}
      {addDrawing && <CreateDrawing />}
    </>
  )}
    </>
};

export default Notes