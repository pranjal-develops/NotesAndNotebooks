import { useMemo } from "react";
import Navbar from "../Components/common/Navbar";
import Sidebar from "../Components/Sidebar/Sidebar";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { Outlet } from "react-router-dom";
import { useSidebarResize } from "../hooks/UseSidebarResize";

function Home() {
  const { activeNotebook } = useSelector((state: RootState) => state.notebook);
  const { sidebarType, tempAccentColor } = useSelector(
    (state: RootState) => state.ui,
  );

  // Use our new custom hook!
  const { sidebarWidth, isResizing, startResizing } = useSidebarResize();

  const accentColor = useMemo(() => {
    return tempAccentColor || activeNotebook?.color || "#8b5cf6";
  }, [tempAccentColor, activeNotebook]);

  return (
    <>
      <div
        className="flex flex-col h-screen w-full transition-colors duration-500
         bg-white md:bg-[hsl(0,0%,95%)] text-gray-900
         dark:bg-[hsl(0,0%,5%)] md:dark:bg-black dark:text-gray-100 
         dark-island:bg-[hsl(0,0%,5%)] dark-island:text-gray-100 md:dark-island:bg-black
         pure-white:md:bg-white
         pitch-black:bg-black
        "
        style={
          {
            "--accent-color": accentColor,
            "--accent-color-light": `${accentColor}15`,
          } as React.CSSProperties
        }
      >
        <Navbar />
        <div className="flex overflow-hidden h-full md:pb-2 md:px-2">
          <Sidebar width={sidebarWidth} />

          {/* Resize Handle */}
          {sidebarType && (
            <div
              onMouseDown={startResizing}
              className={`hidden md:block w-1.5 h-full cursor-col-resize hover:bg-(--accent-color)/30 transition-colors z-30 group relative -ml-1.5 ${isResizing ? "bg-(--accent-color)/50" : ""}`}
            ></div>
          )}

          <main
            className={`relative flex-1 justify-center items-center w-auto h-full overflow-y-auto p-3 md:p-6 md:rounded-2xl
          bg-white 
          dark:bg-[hsl(0,0%,5%)]
          dark-island:bg-[hsl(0,0%,5%)]
          pitch-black:bg-black
            ${isResizing ? "select-none pointer-events-none" : ""}`}
          >
            <Outlet
            // context={{
            //   notes: filteredNotes,
            //   loading,
            // }}
            />
          </main>
        </div>
      </div>
    </>
  );
}

export default Home;
