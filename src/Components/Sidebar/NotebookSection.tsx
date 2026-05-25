import React, { useState } from 'react'
import { BsChevronDown, BsChevronRight, BsFileEarmarkText, BsJournalText, BsPlusLg } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { notebookApi } from '../../api';
import { setActiveNotebook, setActivePage } from '../../store/slice/notebookSlice';
import { setActiveView } from '../../store/slice/uiSlice';

const NotebookSection = () => {
    const dispatch = useDispatch();
    const { notebooks, activeNotebook, activePage } = useSelector((state: RootState) => state.notebook);
    const [expandedNotebooks, setExpandedNotebooks] = useState<Record<number, boolean>>({});

    //   Toggle Accordion
    const toggleNotebook = (id: number) => {
        setExpandedNotebooks(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    //   Handle Page Selection
    const handlePageClick = async (notebookId: number, pageId: number) => {
        try {
            // 1. Find the notebook in our state and set it as active
            const notebook = notebooks.find(n => n.id === notebookId);
            if (notebook) dispatch(setActiveNotebook(notebook));

            // 2. Fetch and set the page
            const response = await notebookApi.getPage(notebookId, pageId);
            dispatch(setActivePage(response.data));
            
            // 3. Switch view
            dispatch(setActiveView('notebook-content'));
        } catch (error) {
            console.error("Failed to fetch page", error);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between px-2 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <span>Notebooks</span>
                <button 
                    onClick={() => dispatch(setActiveView('create-notebook'))}
                    className="hover:text-purple-600 transition-colors"
                >
                    <BsPlusLg size={14} />
                </button>
            </div>

            <div className="space-y-1">
                {notebooks.map((nb) => (
                    <div key={nb.id}>
                        {/* Notebook Item */}
                        <button
                            onClick={() => toggleNotebook(nb.id)}
                            className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeNotebook?.id === nb.id ? 'bg-purple-100 text-purple-700' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800'
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
                                        className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${activePage?.id === page.id
                                                ? 'text-purple-600 bg-purple-50 dark:bg-purple-900/20'
                                                : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-100'
                                            }`}
                                    >
                                        <BsFileEarmarkText size={14} />
                                        <span className="truncate">{page.title}</span>
                                    </button>
                                ))}
                                <button 
                                    onClick={() => {/* TODO: Handle new page creation */}}
                                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-gray-400 hover:text-purple-600 transition-colors"
                                >
                                    <BsPlusLg size={12} /> New Page
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default NotebookSection