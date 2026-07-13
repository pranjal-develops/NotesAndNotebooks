import { useEffect, useState } from "react";
import Search from "./Search";
import { GiHamburgerMenu } from "react-icons/gi";
import {SetSideBarOpen} from "../store/slice/uiSlice"
import { useDispatch } from "react-redux";

//  const toggleDarkMode = () =>{
//     document.body.classList.toggle('dark-mode');
//   };

const Navbar = () => {

  const dispatch = useDispatch();

  const [isDark, setIsDark] = useState(() => {
    const currTheme = localStorage.getItem("theme") || "light";
    return currTheme === "dark";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    setIsDark(!isDark);    //setState is async so it will imediately not change
    // document.documentElement.classList.toggle("dark", !isDark); Since I am using isDark as a parameter in useEffect, it will run every time the page is reloaded so there is no need for this

    localStorage.setItem("theme", newTheme);
  };

  return (
    // <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
    // <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-black backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
    <header className="sticky top-0 bg-transparent flex items-center justify-between px-2 md:px-6 py-4">
      <div className="flex items-center gap-2">
        <button className="cursor-pointer bg-zinc-100 rounded-xl p-2 hover:bg-white dark:bg-[hsl(0,0%,5%)] dark:hover:bg-[hsl(0,0%,10%)] z-50 mr-2" onClick={()=>dispatch(SetSideBarOpen())}><GiHamburgerMenu /></button>
        <h3 className="hidden md:flex text-xl font-bold bg-linear-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Note</h3>
      </div>
      <Search/>
      <div className="flex items-center gap-3">
        {/* <button
          onClick={() => dispatch(AddNoteTrue())}
          className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-full hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/30 active:scale-95 animate-pulse"
        >
          Add Note
        </button> */}
        <button
          onClick={toggleTheme}
          className="p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 hover:dark:text-zinc-100 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 hover:dark:bg-zinc-700 rounded-full transition-all active:scale-95 ml-2"
          aria-label="Toggle theme"
        >
          {isDark ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
          )}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
