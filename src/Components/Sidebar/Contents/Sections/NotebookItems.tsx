import { useState } from "react";
import type { Notebook } from "../../../../types";
import type { RootState } from "../../../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { LuNotebookPen, LuNotebookText } from "react-icons/lu";
import {
  setActiveNotebook
} from "../../../../store/slice/notebookSlice";
import { BsFileEarmarkText, BsPlusLg } from "react-icons/bs";
import { Link } from "react-router-dom";
import { setSelectedTag } from "../../../../store/slice/noteSlice";

const NotebookItems = ({ notebook }: { notebook: Notebook }) => {
  const dispatch = useDispatch();
  const { activeNotebook, activePage } = useSelector(
    (state: RootState) => state.notebook,
  );
  const [expandedNotebooks, setExpandedNotebooks] = useState<
    Record<number, boolean>
  >({});

  //   Toggle Accordion
  const toggleNotebook = (id: number) => {
    setExpandedNotebooks((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handlePageClick = () => {
    dispatch(setActiveNotebook(notebook));
    dispatch(setSelectedTag(null));
  };

  return (
    <div key={notebook.id}>
      {/* Notebook Item */}
      <div
        className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeNotebook?.id === notebook.id
            ? "bg-(--accent-color-light) text-(--accent-color)"
            : "text-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-800 dark-island:hover:bg-zinc-800 pitch-black:hover:bg-zinc-800"
          }`}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => toggleNotebook(notebook.id)}
            className="cursor-pointer"
          >
            {notebook.logo ? (
              <img
                src={
                  notebook.logo.startsWith("data:")
                    ? notebook.logo
                    : `data:image/png;base64,${notebook.logo}`
                }
                alt={`${notebook.name ?? "Notebook"} logo`}
                className="h-4 w-4 object-contain"
              />
            ) : expandedNotebooks[notebook.id] ? (
              <LuNotebookPen
                className={`text-(--accent-color) transition-opacity ${activeNotebook?.id === notebook.id
                    ? "opacity-100"
                    : "opacity-50"
                  }`}
                size={18}
              />
            ) : (
              <LuNotebookText
                className={`text-(--accent-color) transition-opacity ${activeNotebook?.id === notebook.id
                    ? "opacity-100"
                    : "opacity-50"
                  }`}
                size={18}
              />
            )}
          </button>
          <Link
            to={`/notebooks/${notebook.id}`}
            onClick={() => handlePageClick()}
            className="truncate">{notebook.name}
          </Link>
        </div>
      </div>

      {/* Nested Pages (Accordion Content) */}
      {expandedNotebooks[notebook.id] && (
        <div className="ml-9 mt-1 space-y-1">
          {notebook.pages.map((page) => (
            <Link
              key={page.id}
              onClick={() => handlePageClick()}
              to={`/notebooks/${notebook.id}/pages/${page.id}`}
              className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors hover:text-(--accent-color) ${activePage?.id === page.id
                  ? "text-(--accent-color) bg-(--accent-color-light)"
                  : "text-zinc-500"
                }`}
            >
              <BsFileEarmarkText size={14} />
              <span className="truncate">{page.title}
              </span>
            </Link>
          ))}
          <Link
            onClick={() => dispatch(setActiveNotebook(notebook))}
            to={`/notebooks/${notebook.id}/pages/create`}
            className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-zinc-400 hover:text-(--accent-color) transition-colors"
          >
            <BsPlusLg size={12} /> New Page
          </Link>
        </div>
      )}
    </div>
  );
};

export default NotebookItems;
