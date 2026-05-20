import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store/store';
import { setNotebooks, setActiveNotebook, setActivePage } from '../store/slice/notebookSlice';
import { notebookApi } from '../api'; // Adjust path to your api file
import { 
  BsJournalText, 
  BsChevronDown, 
  BsChevronRight, 
  BsPlusLg, 
  BsFileEarmarkText,
  BsSticky
} from 'react-icons/bs';
import MobileSidebar from './Sidebar/MobileSidebar';
import TagSection from './Sidebar/TagSection';

const Sidebar: React.FC = () => {
  const dispatch = useDispatch();
  const { isSidebarOpen } = useSelector((state: RootState) => state.ui);
  const { notebooks, activeNotebook, activePage } = useSelector((state: RootState) => state.notebook);
  const [expandedNotebooks, setExpandedNotebooks] = useState<Record<number, boolean>>({});

  // 1. Fetch Notebooks on Mount
  useEffect(() => {
    const fetchNotebooks = async () => {
      try {
        const response = await notebookApi.getAll();
        dispatch(setNotebooks(response.data));
      } catch (error) {
        console.error("Failed to fetch notebooks", error);
      }
    };
    fetchNotebooks();
  }, [dispatch]);

  // 2. Toggle Accordion
  const toggleNotebook = (id: number) => {
    setExpandedNotebooks(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // 3. Handle Page Selection
  const handlePageClick = async (notebookId: number, pageId: number) => {
    try {
      const response = await notebookApi.getPage(notebookId, pageId);
      dispatch(setActivePage(response.data));
      // You might also want to set active notebook here
    } catch (error) {
      console.error("Failed to fetch page", error);
    }
  };

  return (
    <>
    <div className="hidden md:flex w-64 h-screen m-2 px-1 flex flex-col">

      <aside className="flex-1 overflow-y-auto px-2 py-4 space-y-6">
        
        {/* --- NOTES SECTION --- */}
        <div>
          <div className="flex items-center justify-between px-2 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <span>Main</span>
          </div>

          <TagSection/>
          
        </div>

        {/* --- NOTEBOOKS SECTION --- */}
        <div>
          <div className="flex items-center justify-between px-2 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <span>Notebooks</span>
            <button className="hover:text-purple-600 transition-colors">
              <BsPlusLg size={14} />
            </button>
          </div>

          <div className="space-y-1">
            {notebooks.map((nb) => (
              <div key={nb.id}>
                {/* Notebook Item */}
                <button 
                  onClick={() => toggleNotebook(nb.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeNotebook?.id === nb.id ? 'bg-purple-100 text-purple-700' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <BsJournalText className={activeNotebook?.id === nb.id ? 'text-purple-600' : 'text-gray-400'} />
                    <span className="truncate">{nb.name}</span>
                  </div>
                  {expandedNotebooks[nb.id] ? <BsChevronDown size={12} /> : <BsChevronRight size={12} />}
                </button>

                {/* Nested Pages (Accordion Content) */}
                {expandedNotebooks[nb.id] && (
                  <div className="ml-9 mt-1 space-y-1">
                    {nb.pages.map(page => (
                      <button
                        key={page.id}
                        onClick={() => handlePageClick(nb.id, page.id)}
                        className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                          activePage?.id === page.id 
                            ? 'text-purple-600 bg-purple-50 dark:bg-purple-900/20' 
                            : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-100'
                        }`}
                      >
                        <BsFileEarmarkText size={14} />
                        <span className="truncate">{page.title}</span>
                      </button>
                    ))}
                    <button className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-gray-400 hover:text-purple-600 transition-colors">
                      <BsPlusLg size={12} /> New Page
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
    {isSidebarOpen && <MobileSidebar/> }
    </>
  );
};

export default Sidebar;