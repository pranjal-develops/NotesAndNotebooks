import React from 'react'
import Note from './Note';
import type { Note as note } from '../types';
import { BsJournalText } from 'react-icons/bs';

interface NoteProps {
  notes: note[],
  loading: boolean,
  setEditingnote: React.Dispatch<React.SetStateAction<note | null>>;
}

const Notes: React.FC<NoteProps> = ({ notes, loading, setEditingnote }) => {
  const pinnedNotes = notes.filter(n => n.pinned);
  const otherNotes = notes.filter(n => !n.pinned);

  const renderNoteList = (noteList: note[], title?: string) => (
    <div className="mb-8">
      {title && <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 ml-4">{title}</h3>}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 2xl:columns-5 gap-4 space-y-4">
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
          <div className="w-24 h-24 mb-6 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <BsJournalText size={50} className="text-gray-400" />
          </div>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">Your ideas start here</p>
          <p className="text-sm text-gray-500 mt-1">Tap the plus button to capture a thought.</p>
        </div>
      ) : (
        <div className="max-w-[1600px] mx-auto px-4">
          {pinnedNotes.length > 0 && renderNoteList(pinnedNotes, "Pinned")}
          {pinnedNotes.length > 0 && otherNotes.length > 0 && <div className="h-px bg-gray-200 dark:bg-gray-800 my-8" />}
          {renderNoteList(otherNotes, pinnedNotes.length > 0 ? "Others" : undefined)}
        </div>
      )}
    </>
  );
};

export default Notes