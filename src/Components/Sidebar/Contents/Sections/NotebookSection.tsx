// import { useState } from "react";
import {
  BsPlusLg,
  //  BsChevronDown, BsChevronRight,
} from "react-icons/bs";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../store/store";
import NotebookItems from "./NotebookItems";
import { Link } from "react-router-dom";

const NotebookSection = () => {
  const { notebooks } = useSelector((state: RootState) => state.notebook);
  // const [showNotebooks, setshowNotebooks] = useState(true);

  return (
    <div>
      <div className="flex items-center justify-between px-2 mb-2 text-xs font-semibold text-zinc-500 uppercase tracking-[0.22em] dark:text-slate-400 dark-island:text-slate-400 pitch-black:text-slate-500">
        <span>Notebooks</span>
        <div className="flex flex-row items-center gap-2">
          <Link
            to="/notebooks/create"
            className="hover:text-purple-600 transition-colors"
          >
            <BsPlusLg size={14} />
          </Link>
          <span className="rounded-full bg-slate-200/70 px-2.5 py-1 text-[11px] text-zinc-600 dark:bg-zinc-800 dark-island:bg-zinc-800 pitch-black:bg-zinc-800 dark:text-slate-300 dark-island:text-slate-200 pitch-black:text-slate-300">
            {notebooks.length}
          </span>
          {/* </div> */}
        </div>
      </div>

      <div className="space-y-1">
        {
          // showNotebooks &&
          notebooks.map((nb) => (
            <NotebookItems key={nb.id} notebook={nb} />
          ))
        }
      </div>
    </div>
  );
};

export default NotebookSection;
