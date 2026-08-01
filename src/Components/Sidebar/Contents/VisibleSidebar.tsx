import { CiStickyNote } from "react-icons/ci";
import { MdOutlineDraw } from "react-icons/md";
import { SlNotebook } from "react-icons/sl";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { SetSidebarType } from "../../../store/slice/uiSlice";
import { setViewingDrawings } from "../../../store/slice/noteSlice";

const VisibleSidebar = () => {
  const dispatch = useDispatch();
  const { sidebarType } = useSelector((state: RootState) => state.ui);

  const handleSidebar = (e: "notes" | "notebooks" | "drawings") => {
    if (e === sidebarType) dispatch(SetSidebarType(null));
    else dispatch(SetSidebarType(e));
  };

  return (
    <div className="hidden md:flex flex-col items-center w-10 text-2xl p-5 pr-7 pitch-black:text-white">
      <button
        onClick={() => {
          handleSidebar("notes");
          dispatch(setViewingDrawings(false));
        }}
        className={`p-2 my-1 rounded-lg cursor-pointer
      ${sidebarType !== "notes" ? "hover:bg-white dark:hover:bg-[hsl(0,0%,10%)] dark-island:hover:bg-[hsl(0,0%,10%)] pitch-black:hover:bg-[hsl(0,0%,10%)]" : "bg-white dark:bg-[hsl(0,0%,10%)] dark-island:bg-[hsl(0,0%,10%)] pitch-black:bg-[hsl(0,0%,10%)]"}`}
      >
        <CiStickyNote />
      </button>
      <button
        onClick={() => {
          handleSidebar("drawings");
          dispatch(setViewingDrawings(true));
        }}
        className={`p-2 my-1 rounded-lg cursor-pointer
      ${sidebarType !== "drawings" ? "hover:bg-white dark:hover:bg-[hsl(0,0%,10%)] dark-island:hover:bg-[hsl(0,0%,10%)] pitch-black:hover:bg-[hsl(0,0%,10%)]" : "bg-white dark:bg-[hsl(0,0%,10%)] dark-island:bg-[hsl(0,0%,10%)] pitch-black:bg-[hsl(0,0%,10%)]"}`}
      >
        <MdOutlineDraw />
      </button>
      <button
        onClick={() => {
          handleSidebar("notebooks");
          dispatch(setViewingDrawings(false));
        }}
        className={`p-2 my-1 rounded-lg cursor-pointer
      ${sidebarType !== "notebooks" ? "hover:bg-white dark:hover:bg-[hsl(0,0%,10%)] dark-island:hover:bg-[hsl(0,0%,10%)] pitch-black:hover:bg-[hsl(0,0%,10%)]" : "bg-white dark:bg-[hsl(0,0%,10%)] dark-island:bg-[hsl(0,0%,10%)] pitch-black:bg-[hsl(0,0%,10%)]"}`}
      >
        <SlNotebook />
      </button>
    </div>
  );
};

export default VisibleSidebar;
