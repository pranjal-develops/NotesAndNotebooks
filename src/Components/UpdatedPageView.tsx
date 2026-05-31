import React from "react";
import { BsArrowLeft, BsDownload } from "react-icons/bs";
import type { RootState } from "../store/store";
import { useSelector } from "react-redux";

const UpdatedPageView = () => {
  
      const { activePage, activeNotebook } = useSelector((state: RootState) => state.notebook);
  
  return (
    <div className="relative w-full h-full flex flex-col justify-center items-center overflow-y-auto custom-scrollbar">
      <header className="w-full h-16 flex flex-col justify-between items-center">
      <button
        // onClick={() => dispatch(setActiveView("notes"))}
        className=" absolute top-0 left-0 text-gray-400 hover:text-purple-600 flex items-center gap-1 text-xs font-bold uppercase tracking-widest"
      >
        <BsArrowLeft /> Back
      </button>

      {/* <button className="absolute top-0 right-0 text-xs font-bold hover:text-purple-600 transition-colors flex items-center gap-1">
        <BsDownload /> Export Markdown
      </button> */}
      <div className="absolute top-0 right-0 flex items-center gap-4 text-gray-400">
                              <span className="text-xs font-medium">Last edited 2 mins ago</span>
                              <button className="text-xs font-bold hover:text-purple-600 transition-colors flex items-center gap-1">
                                  <BsDownload /> Export Markdown
                              </button>
                          </div>
        {/* <div className="flex justify-center items-center">UpdatedPageView</div> */}
        {/* <h1 className="text-5xl font-black text-gray-900 dark:text-white tracking-tight outline-none mb-4"> */}
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white tracking-tight outline-none mb-4">
                        {activePage.title}
                    </h1>
      </header>

      

    </div>
  );
};

export default UpdatedPageView;
