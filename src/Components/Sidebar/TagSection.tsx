import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { setSelectedTag } from '../../store/slice/noteSlice';
import { BsSticky } from 'react-icons/bs';

const TagSection = () => {
    const dispatch = useDispatch();
    
    const { notes, selectedTag } = useSelector((state: RootState) => state.note);
    const allTags = Array.from(new Set(notes.flatMap(note => note.tags || [])));

    
  return (
    <div className="mt-8 border-t border-gray-100 dark:border-gray-800 pt-6">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-4">Tags</h3>
            <div className="space-y-1">
              <button onClick={() => dispatch(setSelectedTag(null))} className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-xl transition-all group ${selectedTag === null
                    ? 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <span className={`text-purple-500 transition-opacity ${selectedTag === null ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'}`}><BsSticky /> </span>
                  All Notes
                </button>
              {allTags.length >0 && allTags.map(tag => (
                <button key={tag} onClick={() => dispatch(setSelectedTag(tag))} className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-xl transition-all group ${selectedTag === tag
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
  )
}

export default TagSection