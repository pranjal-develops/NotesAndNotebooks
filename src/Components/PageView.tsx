import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store/store';
import type { Block, BlockType } from '../types';
import { BsPlusLg, BsCodeSlash, BsPencilFill, BsType, BsDownload, BsArrowLeft, BsTrash, BsImage, BsCloudArrowUp, BsCheck2All } from 'react-icons/bs';
import { notebookApi } from '../api';
import { setActiveView } from '../store/slice/uiSlice';
import DrawingCanvas from './Canvas';
import TextSection from './TextSection';
import { convertToMarkdown, downloadMarkdown } from '../utils/markdownExport';

const PageView = () => {

    const dispatch = useDispatch();
    const { activePage, activeNotebook } = useSelector((state: RootState) => state.notebook);
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
    const [isResizing, setIsResizing] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');

    // 1. Handle Image Resizing
    const handleImageResize = (e: MouseEvent | TouchEvent, id: string) => {
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
        const imgElement = document.getElementById(`img-${id}`);
        if (imgElement) {
            const rect = imgElement.getBoundingClientRect();
            const newWidth = Math.max(100, clientX - rect.left);
            setBlocks(prev => prev.map(b => b.id === id ? { ...b, width: newWidth } : b));
        }
    };

    useEffect(() => {
        const handleMove = (e: MouseEvent | TouchEvent) => {
            if (isResizing && selectedBlockId) {
                handleImageResize(e, selectedBlockId);
            }
        };

        const handleUp = () => {
            setIsResizing(false);
        };

        if (isResizing) {
            window.addEventListener('mousemove', handleMove);
            window.addEventListener('mouseup', handleUp);
            window.addEventListener('touchmove', handleMove);
            window.addEventListener('touchend', handleUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('mouseup', handleUp);
            window.removeEventListener('touchmove', handleMove);
            window.removeEventListener('touchend', handleUp);
        };
    }, [isResizing, selectedBlockId]);

    // Handle Paste Event for Images
    useEffect(() => {
        const handlePaste = async (e: ClipboardEvent) => {
            const items = e.clipboardData?.items;
            if (!items) return;

            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    const file = items[i].getAsFile();
                    if (!file) continue;

                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const imageData = event.target?.result as string;
                        const newBlock: Block = {
                            id: Date.now().toString(),
                            type: 'image',
                            content: imageData
                        };
                        setBlocks(prev => [...prev, newBlock]);
                    };
                    reader.readAsDataURL(file);
                }
            }
        };

        window.addEventListener('paste', handlePaste);
        return () => window.removeEventListener('paste', handlePaste);
    }, []);

    // 1. Load blocks from activePage.content when it changes
    useEffect(() => {
        if (activePage?.content) {
            try {
                setBlocks(JSON.parse(activePage.content));
            } catch {
                // Fallback for empty or legacy text content
                setBlocks([{ id: '1', type: 'text', content: activePage.content }]);
            }
        } else {
            setBlocks([{ id: Date.now().toString(), type: 'text', content: '' }]);
        }
    }, [activePage]);

    if (!activeNotebook || !activePage) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <p>No notebook or page selected.</p>
                <button
                    onClick={() => dispatch(setActiveView('notes'))}
                    className="mt-4 text-purple-600 hover:underline"
                >
                    Go back to Notes
                </button>
            </div>
        );
    }

    // 2. Add a new block
    const addBlock = (type: BlockType) => {
        const newBlock: Block = {
            id: Date.now().toString(),
            type,
            content: '',
            language: type === 'code' ? 'javascript' : undefined
        };
        setBlocks([...blocks, newBlock]);
    };

    // 3. Update block content
    const updateBlock = (id: string, newContent: string) => {
        setBlocks(blocks.map(b => b.id === id ? { ...b, content: newContent } : b));
    };

    const deleteBlock = (id: string) => {
        if (blocks.length > 1) {
            setBlocks(blocks.filter(b => b.id !== id));
        }
    };

    useEffect(() => {
        if (blocks.length === 0) return;

        // Check if blocks actually changed from what's in Redux
        const contentString = JSON.stringify(blocks);
        if (contentString === activePage.content) return;

        setSaveStatus('saving');

        const timer = setTimeout(async () => {
            try {
                await notebookApi.updatePage(activeNotebook.id, activePage.id, {
                    ...activePage,
                    content: contentString
                });
                setSaveStatus('saved');
            } catch (error) {
                setSaveStatus('error');
                console.error("Auto-save failed", error);
            }
        }, 1500); // Wait 1.5 seconds after the last change

        return () => clearTimeout(timer);
    }, [blocks, activePage, activeNotebook.id]);

    return (
        <div className="flex-1 bg-white dark:bg-transparent overflow-y-auto custom-scrollbar">
            <div className="max-w-3xl mx-auto py-20 px-10">

                {/* 1. SEAMLESS HEADER */}
                <header className="mb-12 group/header">
                    <div className="flex items-center gap-3 mb-6 opacity-0 group-hover/header:opacity-100 transition-opacity">
                        <button onClick={() => dispatch(setActiveView('notes'))} className="text-gray-400 hover:text-purple-600 flex items-center gap-1 text-xs font-bold uppercase tracking-widest">
                            <BsArrowLeft /> Back
                        </button>
                        <div className="w-px h-3 bg-zinc-200" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                            {activeNotebook.name}
                        </span>
                    </div>

                    <h1 className="text-5xl font-black text-gray-900 dark:text-white tracking-tight outline-none mb-4">
                        {activePage.title}
                    </h1>

                    <div className="flex items-center gap-4 text-gray-400">
                        <span className="text-xs font-medium">Last edited 2 mins ago</span>
                        <button className="text-xs font-bold hover:text-purple-600 transition-colors flex items-center gap-1">
                            <BsDownload /> Export Markdown
                        </button>
                    </div>
                </header>

                {/* 2. THE DOCUMENT CANVAS */}
                <div className="space-y-2 editor-canvas">
                    {blocks.map((block) => (
                        <div key={block.id} className="group relative -ml-12 flex gap-4">

                            {/* THE GUTTER (Hidden until hover) */}
                            <div className="w-8 flex flex-col items-center pt-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                                <button onClick={() => deleteBlock(block.id)} className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors">
                                    <BsTrash size={14} />
                                </button>
                            </div>

                            {/* THE CONTENT */}
                            <div className="flex-1">
                                {block.type === 'text' && (
                                    <TextSection
                                        initialValue={block.content}
                                        onChange={(html) => updateBlock(block.id, html)}
                                    />
                                )}

                                {block.type === 'code' && (
                                    <div className="my-6 rounded-xl bg-zinc-100 dark:bg-zinc-800/50 border border-gray-100 dark:border-gray-800 p-1">
                                        <div className="flex justify-between px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                            <span>{block.language}</span>
                                            <button onClick={() => navigator.clipboard.writeText(block.content)} className="hover:text-purple-600">Copy</button>
                                        </div>
                                        <textarea
                                            className="w-full bg-transparent p-4 font-mono text-sm text-purple-600 dark:text-purple-400 outline-none resize-none"
                                            value={block.content}
                                            onChange={(e) => updateBlock(block.id, e.target.value)}
                                            rows={block.content.split('\n').length || 3}
                                        />
                                    </div>
                                )}

                                {block.type === 'drawing' && (
                                    <div className="my-8 hover:ring-2 hover:ring-purple-100 dark:hover:ring-purple-900/30 rounded-2xl transition-all overflow-hidden">
                                        <DrawingCanvas initialData={block.content} onSave={(d) => updateBlock(block.id, d)} />
                                    </div>
                                )}

                                {block.type === 'image' && (
                                    <div className={`my-8 relative inline-block group/img ${selectedBlockId === block.id ? 'ring-4 ring-purple-500/20' : ''}`}>
                                        <img
                                            id={`img-${block.id}`}
                                            src={block.content}
                                            style={{ width: block.width || '100%' }}
                                            className="rounded-xl cursor-pointer"
                                            onClick={(e) => { e.stopPropagation(); setSelectedBlockId(block.id); }}
                                        />
                                        {/* ... (resize handle) */}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. MINIMALIST FLOATING TOOLBAR */}
            <div className="fixed bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-1 p-1.5 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-2xl border border-white dark:border-gray-700 shadow-2xl rounded-2xl animate-in slide-in-from-bottom-10">

                <button onClick={() => addBlock('text')} className="flex items-center gap-2 px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-xl text-gray-600 dark:text-gray-300 transition-all">
                    <BsType /> <span className="text-xs font-bold">Text</span>
                </button>
                <button onClick={() => addBlock('code')} className="flex items-center gap-2 px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-xl text-gray-600 dark:text-gray-300 transition-all">
                    <BsCodeSlash /> <span className="text-xs font-bold">Code</span>
                </button>
                <button onClick={() => addBlock('drawing')} className="flex items-center gap-2 px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-xl text-gray-600 dark:text-gray-300 transition-all">
                    <BsPencilFill /> <span className="text-xs font-bold">Draw</span>
                </button>
                <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-700 my-auto mx-1" />
                <div className="flex items-center px-2 text-[10px] font-black uppercase tracking-tighter text-gray-400">
                    Ctrl+V to paste image
                </div>
            </div>
        </div>
    );
};

export default PageView;