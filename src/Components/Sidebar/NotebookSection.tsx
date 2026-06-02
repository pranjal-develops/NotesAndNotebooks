import React, { useState } from "react";
import { BsChevronDown, BsChevronRight, BsPlusLg } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { setActiveView } from "../../store/slice/uiSlice";
import NotebookItems from "./NotebookItems";
import {Link} from "react-router-dom";


const NotebookSection = () => {
  const dispatch = useDispatch();
  const { notebooks } = useSelector((state: RootState) => state.notebook);
  const [showNotebooks, setshowNotebooks] = useState(true);

  return (
    <div>
      <div className="flex items-center justify-between px-2 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        <button
          className="flex items-center justify-between"
          onClick={() => setshowNotebooks(!showNotebooks)}
        >
          {showNotebooks ? (
            <BsChevronDown size={12} />
          ) : (
            <BsChevronRight size={12} />
          )}
          <span className="uppercase tracking-wider pl-2">Notebooks</span>
        </button>
        <Link
          to="/notebooks/create"
          className="hover:text-purple-600 transition-colors"
        >
          <BsPlusLg size={14} />
        </Link>
      </div>

      <div className="space-y-1">
        {showNotebooks &&
          notebooks.map((nb) => <NotebookItems notebook={nb} />)}
      </div>
    </div>
  );
};

export default NotebookSection;
