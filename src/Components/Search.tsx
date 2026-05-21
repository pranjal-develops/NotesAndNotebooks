import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../store/store'
import { setSearchText } from '../store/slice/noteSlice'
import { BsSearch, BsXCircleFill } from 'react-icons/bs'
 


const Search = () => {
  const {searchText} = useSelector((state:RootState)=>state.note)
  const dispatch = useDispatch();
  const inputRef = React.useRef<HTMLInputElement>(null); 

   // Keyboard shortcut effect
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
          <div className="relative w-full max-w-md group">
  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
    <BsSearch className="text-gray-400 group-focus-within:text-purple-500 transition-colors" />
  </div>
  <input
    ref={inputRef}
    type="text"
    value={searchText}
    className="block w-full pl-10 pr-3 py-2 border border-[hsl(0,0%,85%)] dark:border-[hsl(0,0%,15%)] md:border-transparent bg-white dark:bg-[hsl(0,0%,20%)] rounded-xl leading-5 placeholder-gray-500 focus:outline-none focus:bg-white dark:focus:bg-[hsl(0,0%,15%)] focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all sm:text-sm dark:text-gray-100"
    placeholder="Search your notes..."
    onChange={(e) => dispatch(setSearchText(e.target.value))}
  />
  {searchText && (
        <button 
          onClick={() => dispatch(setSearchText(''))}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <BsXCircleFill /> {/* Add this icon from react-icons/bs */}
        </button>
      )}
      <div className="absolute inset-y-0 right-3 hidden md:flex items-center pointer-events-none">
        <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-gray-400 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md">
          /
        </kbd>
      </div>
</div>
            // <input type="text" placeholder='Search' className=' hidden md:flex search w-[40%] h-8.75 border rounded-full border-black dark:border-[hsl(0,0%,25%)] px-10' value={searchText} onChange={(e) => dispatch(setSearchText(e.target.value))} />
  )
}

export default Search