import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { setSelectedTag } from '../../store/slice/noteSlice';
import { BsSticky } from 'react-icons/bs';
import {useNavigate, useLocation} from 'react-router-dom'

const NotesSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { notes, selectedTag } = useSelector((state: RootState) => state.note);
  const allTags = Array.from(new Set(notes.flatMap(note => note.tags || [])));

  const handleTagClick = (tag: string | null) => {
  dispatch(setSelectedTag(tag));
  
  // If we are NOT on the /notes page, navigate there!
  if (location.pathname !== "/notes") {
    navigate("/notes");
  }
};

  return (
    <section className='space-y-3'>
      <div className="flex items-center justify-between px-2 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-[0.22em] dark:text-slate-400">
        <span>Notes</span>
        <span className="rounded-full bg-slate-200/70 px-2.5 py-1 text-[11px] text-zinc-600 dark:bg-zinc-800 dark:text-slate-300">
          {notes.length}
        </span>
      </div>
      {/* <div className="mt-8 border-t border-gray-100 dark:border-gray-800 pt-6"> */}
       <div className="space-y-2">
          <button onClick={() => handleTagClick(null)} className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-xl transition-all group ${selectedTag === null
            ? 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <span className={`text-purple-500 transition-opacity ${selectedTag === null ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'}`}><BsSticky /> </span>
            <span className="flex-1 text-left tracking-wide">All Notes</span>
            <span className="rounded-full bg-black/5 px-2 py-0.5 text-[11px] dark:bg-white/10">{notes.length}</span>
          </button>
          {allTags.length > 0 && allTags.map(tag => (
            <button key={tag} onClick={() => handleTagClick(tag)} className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-xl transition-all group ${selectedTag === tag
              ? 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <span className={`text-purple-500 transition-opacity ${selectedTag === tag ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'}`}><BsSticky /> </span>
              <span className="truncate tracking-wide">{tag}</span>
            </button>
          ))}
        </div>  
    </section>
  )
}

export default NotesSection