import React from 'react';
import type {Note as NoteType} from '../types';
import { BsPinAngleFill } from 'react-icons/bs';

interface noteProps {
  note: NoteType;
  onClk: () => void;
}

const Note: React.FC<noteProps> = ({ note, onClk }) => {
  // Use the note color or a default
  const bgColor = note.color || 'transparent';

const relativeDate = (offsetDateTime: string): string => {
  // Parse OffsetDateTime string by letting Date parse the ISO-8601 with offset
  const then = new Date(offsetDateTime);
  if (isNaN(then.getTime())) return offsetDateTime; // fallback if unparseable

  const now = new Date();
  const diffMs = now.getTime() - then.getTime();
  if (diffMs < 0) {
    // future date — return local date string of input
    return then.toLocaleDateString();
  }

  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffMs <= hour) {
    const mins = Math.max(1, Math.floor(diffMs / minute));
    return `${mins} minute${mins === 1 ? '' : 's'} ago`;
  }

  if (diffMs < 24 * hour) {
    const hrs = Math.floor(diffMs / hour);
    return `${hrs} hour${hrs === 1 ? '' : 's'} ago`;
  }

  const days = Math.floor(diffMs / day);
  if (days <= 30) {
    return `${days} day${days === 1 ? '' : 's'} ago`;
  }

  // Otherwise return local date string (e.g., "5/4/2026" depending on locale)
  return then.toLocaleDateString();
};


  return (
    <div 
      className='group relative flex flex-col p-5 rounded-xl border border-[hsl(0,0%,85%)] dark:border-[hsl(0,0%,20%)] shadow-sm hover:shadow-md transition-all active:scale-98 duration-150 cursor-pointer overflow-hidden '
      style={{ backgroundColor: bgColor }} // Apply dynamic color
      onClick={onClk}
    >
      {note.pinned && (
        <div className="absolute top-3 right-3 text-gray-400">
          <BsPinAngleFill size={16} />
        </div>
      )}
      
      {note.title && (
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 leading-tight">
          {note.title}
        </h2>
      )}

      <div className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap break-words">
        {note.description}
      </div>

      {note.drawingData && (
        <div className="mt-3 rounded-lg overflow-hidden bg-white/10">
          <img src={note.drawingData} alt="" className="w-full h-auto object-contain" />
        </div>
      )}
      
      {/* Date indicator for a professional touch */}
      <div className="mt-4 text-[10px] text-gray-500 font-medium">
        {note.updatedDate ? `Edited ${relativeDate(note.updatedDate)}` : ''}
      </div>
    </div>
  );
};


export default Note