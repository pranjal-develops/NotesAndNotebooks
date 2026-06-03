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
    <>
      <div className="flex items-center justify-between px-2 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        <span>Notes</span>
      </div>
      {/* <div className="mt-8 border-t border-gray-100 dark:border-gray-800 pt-6"> */}
      <div className='mt-4'>
        <div className="space-y-1">
          <button onClick={() => handleTagClick(null)} className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-xl transition-all group ${selectedTag === null
            ? 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <span className={`text-purple-500 transition-opacity ${selectedTag === null ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'}`}><BsSticky /> </span>
            All Notes
          </button>
          {allTags.length > 0 && allTags.map(tag => (
            <button key={tag} onClick={() => handleTagClick(tag)} className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-xl transition-all group ${selectedTag === tag
              ? 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <span className={`text-purple-500 transition-opacity ${selectedTag === tag ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'}`}><BsSticky /> </span>
              {tag}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}

export default NotesSection