import NotesSection from "./Sections/NotesSection";
import NotebookSection from "./Sections/NotebookSection";
import type React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import DrawingSections from "./Sections/DrawingSections";

interface SidebarProps {
  width?: number;
}

const SidebarContent: React.FC<SidebarProps> = ({ width = 288 }) => {
  const { sidebarType } = useSelector((state: RootState) => state.ui);

  return (
    <div
      className="hidden md:flex h-full mr-1.5 flex-col overflow-hidden "
      style={{ width: `${width}px` }}
    >
      <aside
        className={`flex-1 overflow-y-auto overflow-x-hidden px-2 py-5 space-y-6 custom-scrollbar
        island:bg-white island:rounded-2xl 
        dark-island:bg-[hsl(0,0%,5%)] dark-island:rounded-2xl
        `}
      >
        {sidebarType === "notes" && <NotesSection />}
        {sidebarType === "drawings" && <DrawingSections />}
        {sidebarType === "notebooks" && <NotebookSection />}
      </aside>
    </div>
  );
};

export default SidebarContent;
