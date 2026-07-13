import { useState } from "react";
import type { Notebook } from "../../types";
import type { RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { LuNotebookPen, LuNotebookText } from "react-icons/lu";
import {
  setActiveNotebook,
//   setActivePage,
} from "../../store/slice/notebookSlice";
// import { notebookApi } from "../../api";
// import { setActiveView } from "../../store/slice/uiSlice";
import { BsFileEarmarkText, BsPlusLg } from "react-icons/bs";
import { Link } from "react-router-dom";
import { setSelectedTag } from "../../store/slice/noteSlice";

const NotebookItems = ({ notebook }: { notebook: Notebook }) => {
  // const { notebooks, activeNotebook, activePage } = useSelector(
  const dispatch = useDispatch();
  const { activeNotebook, activePage } = useSelector(
    (state: RootState) => state.notebook,
  );
  const [expandedNotebooks, setExpandedNotebooks] = useState<
    Record<number, boolean>
  >({});
  // const dispatch = useDispatch();

  //   Toggle Accordion
  const toggleNotebook = (id: number) => {
    setExpandedNotebooks((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

   const handlePageClick = () =>{
    dispatch(setActiveNotebook(notebook));
    dispatch(setSelectedTag(null));
    
  }

  //   Handle Page Selection
  // const handlePageClick = async (notebookId: number, pageId: number) => {
  //   try {
  //     // 1. Find the notebook in our state and set it as active
  //     const notebook = notebooks.find((n) => n.id === notebookId);
  //     if (notebook) dispatch(setActiveNotebook(notebook));

  //     // 2. Fetch and set the page
  //     const response = await notebookApi.getPage(notebookId, pageId);
  //     dispatch(setActivePage(response.data));

  //     // 3. Switch view
  //     // dispatch(setActiveView("notebook-content"));
  //     navigate(`/notebooks/${notebookId}/pages/${pageId}`)


  //   } catch (error) {
  //     console.error("Failed to fetch page", error);
  //   }
  // };

  return (
    <div key={notebook.id}>
      {/* Notebook Item */}
      <button
        className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors ${
          activeNotebook?.id === notebook.id 
  ? "bg-(--accent-color-light) text-(--accent-color)" 
  : "text-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-800"
}`}
      >
        <div className="flex items-center gap-3">
          {/* <BsJournalText className={activeNotebook?.id === notebook.id ? 'text-purple-600' : 'text-zinc-400'} /> */}
          <button 
          onClick={() => toggleNotebook(notebook.id)}
          className="cursor-pointer">
            {notebook.logo ? (
  <img
    src={notebook.logo.startsWith("data:") ? notebook.logo : `data:image/png;base64,${notebook.logo}`}
    alt={`${notebook.name ?? "Notebook"} logo`}
    className="h-4 w-4 object-contain"
  />
) : expandedNotebooks[notebook.id] ? (
  <LuNotebookPen
    className={`text-(--accent-color) transition-opacity ${
      activeNotebook?.id === notebook.id ? "opacity-100" : "opacity-50"
    }`}
    size={18}
  />
) : (
  <LuNotebookText
    className={`text-(--accent-color) transition-opacity ${
      activeNotebook?.id === notebook.id ? "opacity-100" : "opacity-50"
    }`}
    size={18}
  />
)}

                </button>
          <span className="truncate">{notebook.name}</span>
        </div>
      </button>

      {/* Nested Pages (Accordion Content) */}
      {expandedNotebooks[notebook.id] && (
        <div className="ml-9 mt-1 space-y-1">
          {notebook.pages.map((page) => (
            <Link
              key={page.id}
              // onClick={() => handlePageClick(notebook.id, page.id)
              onClick={() => handlePageClick()}
              to={`/notebooks/${notebook.id}/pages/${page.id}`}
              className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activePage?.id === page.id
                  ? "text-(--accent-color) bg-(--accent-color-light)"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
              }`}
            >
              <BsFileEarmarkText size={14} />
              <span className="truncate">{page.title}</span>
            </Link>
          ))}
          <Link
            onClick={()=>dispatch(setActiveNotebook(notebook))}
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
