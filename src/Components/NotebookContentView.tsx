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

const NotebookContentView = () => {
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
    // <div className="max-w-4xl mx-auto h-full p-8 space-y-8 pb-32">
    <div className="max-w-4xl mx-5 h-full p-8 space-y-8">
      {/* 1. Page Header */}
      <header className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-4">
          <button
            onClick={() => dispatch(setActiveView('notes'))}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-400"
          >
            <BsArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: activeNotebook.color }}
              />
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                {activeNotebook.name}
              </span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white">
              {activePage.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 dark:bg-gray-800/50 rounded-full border border-gray-100 dark:border-gray-700">
            {saveStatus === 'saving' ? (
              <>
                <BsCloudArrowUp className="text-blue-500 animate-bounce" />
                <span className="text-[10px] font-bold text-gray-400 uppercase">Saving...</span>
              </>
            ) : saveStatus === 'saved' ? (
              <>
                <BsCheck2All className="text-green-500" />
                <span className="text-[10px] font-bold text-gray-400 uppercase">Saved</span>
              </>
            ) : (
              <span className="text-[10px] font-bold text-red-500 uppercase">Save Error</span>
            )}
          </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl transition-all font-bold text-sm"
        onClick={() => downloadMarkdown(activePage.title, convertToMarkdown(activePage.title, blocks))}>
          <BsDownload /> Export MD
        </button>
      </header>

      {/* 2. Editor Workspace */}

      <div className="space-y-8">
        {blocks.map((block) => (
          <div key={block.id} className="group relative border-l-2 border-transparent hover:border-purple-200 transition-all pl-6">
            <button
              onClick={() => deleteBlock(block.id)}
              className="absolute -left-2 top-0 opacity-0 group-hover:opacity-100 p-1 text-gray-300 hover:text-red-500 transition-all"
            >
              <BsTrash size={14} />
            </button>

            {/* {block.type === 'text' && (
              <textarea
                value={block.content}
                onChange={(e) => updateBlock(block.id, e.target.value)}
                placeholder="Start typing..."
                className="w-full bg-transparent border-none outline-none resize-none overflow-hidden text-lg text-gray-700 dark:text-gray-300 placeholder-gray-400 leading-relaxed"
                rows={1}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = target.scrollHeight + 'px';
                }}
              />
            )} */}

            {block.type === 'text' && (<TextSection initialValue={block.content}
              onChange={(html) => updateBlock(block.id, html)}
              onFocus={() => setSelectedBlockId(block.id)}
            />
            )}

            {block.type === 'code' && (
              <div className="bg-gray-900 rounded-2xl p-6 font-mono text-sm shadow-xl">
                <div className="flex justify-between text-gray-500 mb-4 border-b border-gray-800 pb-2">
                  <span className="text-xs font-bold uppercase tracking-widest">{block.language}</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(block.content)}
                    className="hover:text-white transition-colors flex items-center gap-2"
                  >
                    Copy
                  </button>
                </div>
                <textarea
                  value={block.content}
                  onChange={(e) => updateBlock(block.id, e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-green-400 resize-none custom-scrollbar"
                  rows={4}
                  placeholder="// Paste your code here..."
                />
              </div>
            )}

            {block.type === 'drawing' && (
              <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800">
                <DrawingCanvas
                  initialData={block.content}
                  onSave={(data) => updateBlock(block.id, data)}
                />
              </div>
            )}

            {block.type === 'image' && (
              <div
                className={`relative inline-block group/img ${selectedBlockId === block.id ? 'ring-2 ring-purple-500 rounded-lg' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedBlockId(block.id);
                }}
              >
                <img
                  id={`img-${block.id}`}
                  src={block.content}
                  alt="Pasted content"
                  style={{ width: block.width || 'auto' }}
                  className="block h-auto max-w-full rounded-lg pointer-events-none"
                />

                {selectedBlockId === block.id && (
                  <div
                    onMouseDown={(e) => { e.preventDefault(); setIsResizing(true); }}
                    onTouchStart={() => setIsResizing(true)}
                    className="absolute bottom-0 right-0 w-4 h-4 bg-purple-600 rounded-tl-md rounded-br-lg cursor-nwse-resize flex items-center justify-center shadow-lg"
                  >
                    <div className="w-1.5 h-1.5 border-r-2 border-b-2 border-white transform -translate-x-0.5 -translate-y-0.5" />
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Floating Toolbar */}
      <div
        onClick={() => setSelectedBlockId(null)}
        className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-2xl rounded-2xl p-2 flex gap-2 border border-white/20 dark:border-gray-700 animate-in slide-in-from-bottom-8 duration-500"
      >
        <button onClick={() => addBlock('text')} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl text-gray-600 dark:text-gray-300 transition-all">
          <BsType /> <span className="text-xs font-bold">Text</span>
        </button>
        <button onClick={() => addBlock('code')} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl text-gray-600 dark:text-gray-300 transition-all">
          <BsCodeSlash /> <span className="text-xs font-bold">Code</span>
        </button>
        <button onClick={() => addBlock('drawing')} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl text-gray-600 dark:text-gray-300 transition-all">
          <BsPencilFill /> <span className="text-xs font-bold">Draw</span>
        </button>
        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 my-auto mx-1" />
        <div className="flex items-center px-2 text-[10px] font-black uppercase tracking-tighter text-gray-400">
          Ctrl+V to paste image
        </div>
      </div>
    </div>
  );
};

export default NotebookContentView;