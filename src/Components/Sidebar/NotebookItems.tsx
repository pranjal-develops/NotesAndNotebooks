import React, { useState } from "react";
import type { Notebook } from "../../types";
import type { RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { LuNotebookPen, LuNotebookText } from "react-icons/lu";
import {
  setActiveNotebook,
  setActivePage,
} from "../../store/slice/notebookSlice";
import { notebookApi } from "../../api";
import { setActiveView } from "../../store/slice/uiSlice";
import { BsFileEarmarkText, BsPlusLg } from "react-icons/bs";

const NotebookItems = ({ notebook }: { notebook: Notebook }) => {
  const { notebooks, activeNotebook, activePage } = useSelector(
    (state: RootState) => state.notebook,
  );
  const [expandedNotebooks, setExpandedNotebooks] = useState<
    Record<number, boolean>
  >({});
  const dispatch = useDispatch();

  //   Toggle Accordion
  const toggleNotebook = (id: number) => {
    setExpandedNotebooks((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  //   Handle Page Selection
  const handlePageClick = async (notebookId: number, pageId: number) => {
    try {
      // 1. Find the notebook in our state and set it as active
      const notebook = notebooks.find((n) => n.id === notebookId);
      if (notebook) dispatch(setActiveNotebook(notebook));

      // 2. Fetch and set the page
      const response = await notebookApi.getPage(notebookId, pageId);
      dispatch(setActivePage(response.data));

      // 3. Switch view
      dispatch(setActiveView("notebook-content"));
    } catch (error) {
      console.error("Failed to fetch page", error);
    }
  };

  return (
    <div key={notebook.id}>
      {/* Notebook Item */}
      <button
        onClick={() => toggleNotebook(notebook.id)}
        className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors ${
          activeNotebook?.id === notebook.id
            ? "bg-purple-100 text-purple-700 dark:bg-[hsl(277,100%,10%)]"
            : "text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800"
        }`}
      >
        <div className="flex items-center gap-3">
          {/* <BsJournalText className={activeNotebook?.id === notebook.id ? 'text-purple-600' : 'text-gray-400'} /> */}
          {expandedNotebooks[notebook.id] ? (
            <LuNotebookPen
              className={
                activeNotebook?.id === notebook.id
                  ? "text-purple-600"
                  : "text-gray-400"
              }
              size={18}
            />
          ) : (
            <LuNotebookText
              className={
                activeNotebook?.id === notebook.id
                  ? "text-purple-600"
                  : "text-gray-400"
              }
              size={18}
            />
          )}
          <span className="truncate">{notebook.name}</span>
        </div>
      </button>

      {/* Nested Pages (Accordion Content) */}
      {expandedNotebooks[notebook.id] && (
        <div className="ml-9 mt-1 space-y-1">
          {notebook.pages.map((page) => (
            <button
              key={page.id}
              onClick={() => handlePageClick(notebook.id, page.id)}
              className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activePage?.id === page.id
                  ? "text-purple-600 bg-purple-50 dark:bg-purple-900/20"
                  : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
              }`}
            >
              <BsFileEarmarkText size={14} />
              <span className="truncate">{page.title}</span>
            </button>
          ))}
          <button
            onClick={() => {
              /* TODO: Handle new page creation */
            }}
            className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-gray-400 hover:text-purple-600 transition-colors"
          >
            <BsPlusLg size={12} /> New Page
          </button>
        </div>
      )}
    </div>
  );
};

export default NotebookItems;
