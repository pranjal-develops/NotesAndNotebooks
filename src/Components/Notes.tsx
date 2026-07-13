import React from 'react'
import Note from './Note';
import type { Note as note } from '../types';
import { BsJournalText } from 'react-icons/bs';
import {useOutletContext} from "react-router-dom";
import type { RootState } from '../store/store';
import { useSelector } from 'react-redux';
import { Card, Skeleton } from './ui/Primitives';
import AddButton from './AddButton';

interface HomeContext {
  notes: note[],
  loading: boolean,
  setEditingnote: React.Dispatch<React.SetStateAction<note | null>>;
}

const Notes = () => {
  const {notes, loading, setEditingnote} = useOutletContext<HomeContext>();
  const { isSidebarOpen } = useSelector((state: RootState) => state.ui);
  const pinnedNotes = notes.filter(n => n.pinned);
  const otherNotes = notes.filter(n => !n.pinned);

  if(loading) return(
    <div className={`columns-1 sm:columns-2 gap-4 space-y-4 ${isSidebarOpen ?"lg:columns-3 xl:columns-4 2xl:columns-5" :"lg:columns-4 xl:columns-5 2xl:columns-6" }`}>
            {Array.from({ length: 8 }).map((_, index) => (
              <Card key={index} className="space-y-4 p-5">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-24 w-full rounded-3xl" />
              </Card>
            ))}
          </div>
  )

  const renderNoteList = (noteList: note[], title?: string) => (
    <div className="mb-8">
      {title && <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4 ml-4">{title}</h3>}
      <div className={`columns-1 sm:columns-2 gap-4 space-y-4 ${isSidebarOpen ?"lg:columns-3 xl:columns-4 2xl:columns-5" :"lg:columns-4 xl:columns-5 2xl:columns-6" }`}>
        {noteList.map((note) => (
          <div key={note.id} className="break-inside-avoid">
            <Note note={note} onClk={() => setEditingnote(note)} />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {notes.length === 0 && !loading ? (
        // <div className="flex flex-col items-center justify-center h-64 text-center opacity-60">
        //   <p className="text-xl font-medium mb-2">No notes yet</p>
        //   <p className="text-sm">Click the + button to add your first note.</p>
        // </div>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 mb-6 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center">
            <BsJournalText size={50} className="text-zinc-400" />
          </div>
          <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Your ideas start here</p>
          <p className="text-sm text-zinc-500 mt-1">Tap the plus button to capture a thought.</p>
        </div>
      ) : (
        // <div className="max-w-[1600px] mx-auto px-4">
        <div className="flex flex-col w-full justify-center px-10">
          {pinnedNotes.length > 0 && renderNoteList(pinnedNotes, "Pinned")}
          {pinnedNotes.length > 0 && otherNotes.length > 0 && <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-8" />}
          {renderNoteList(otherNotes, pinnedNotes.length > 0 ? "Others" : undefined)}
        </div>
      )}
      <AddButton/>
    </>
  );
};

export default Notes