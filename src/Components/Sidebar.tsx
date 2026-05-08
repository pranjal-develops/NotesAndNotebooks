import React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import {SetSideBarOpen} from "../store/slice/uiSlice"

const sideElements = [
  {
    icon: "📝",
    name: "All Notes",
  },
  {
    icon: "⭐",
    name: "Favorites",
  },
  {
    icon: "🗑️",
    name: "Trash",
  },
];

const Sidebar = () => {
  const dispatch = useDispatch();
  const {isSidebarOpen} = useSelector((state:RootState)=>state.ui);
  return (
    <>
      <aside
        className={`h-full md:flex flex-col justify-start p-5 ${isSidebarOpen ? "w-[20%]" : "w-auto hidden"}`}
      >
        {sideElements.map((sideElement,index) => (
          <div className="flex flex-row px-2 py-1 gap-2" key={`${sideElement.name}-${index}`}>
            <h1>{sideElement.icon}</h1>
            {isSidebarOpen && <h1>{sideElement.name}</h1>}
          </div>
        ))}
      </aside>

      {isSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/50">
          <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-black p-5 shadow-lg">
            <button className="mb-4 p-2 rounded" onClick={()=> dispatch(SetSideBarOpen())}>×</button>
            {sideElements.map((sideElement) => (
              <div
                className="flex items-center px-2 py-1 gap-2"
                key={sideElement.icon}
              >
                <span>{sideElement.icon}</span>
                <span>{sideElement.name}</span>
              </div>
            ))}
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;
