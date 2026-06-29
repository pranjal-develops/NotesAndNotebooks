import React, { useRef, useState } from "react";
import TiptapEditor from "./Editor/TiptapEditor";
import Editor from "@monaco-editor/react";
import { Line } from "react-chartjs-2";
import CanvasPad, { type CanvasPadHandle } from "./CanvasPad";
import axios from "axios";
import { BsPlusCircle, BsCode, BsGraphUp, BsPencil, BsImage, BsTrash } from 'react-icons/bs';
import type { PageDTO, Block, BlockType } from "../types";

type Props = {
  notebookId: number;
  page?: PageDTO;
  onSaved?: (page: PageDTO) => void;
};

const PageEditor: React.FC<Props> = ({ notebookId, page: initial, onSaved }) => {
  const [title, setTitle] = useState(initial?.title || "Untitled");
  const [blocks, setBlocks] = useState<Block[]>(initial?.blocks || [
    { id: '1', type: 'text', content: '' }
  ]);

  const addBlock = (type: BlockType) => {
    const newBlock: Block = {
      id: Date.now().toString(),
      type,
      content: type === 'text' ? '' : type === 'code' ? '// write code here' : {},
      metadata: {
        language: type === 'code' ? 'javascript' : undefined
      }
    };
    setBlocks([...blocks, newBlock]);
  };

  const updateBlock = (id: string, content: any, metadata?: any) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, content, metadata: { ...b.metadata, ...metadata } } : b));
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  const savePage = async () => {
    const payload = {
      title,
      contentHtml: JSON.stringify(blocks),
    };

    try {
      let res;
      if (initial?.id) {
        res = await axios.put(`/api/notebooks/${notebookId}/pages/${initial.id}`, payload);
      } else {
        res = await axios.post(`/api/notebooks/${notebookId}/pages`, payload);
      }
      
      const savedData = res.data;
      const savedPage: PageDTO = {
        id: savedData.id,
        notebookId: savedData.notebook_id,
        title: savedData.title,
        blocks: JSON.parse(savedData.contentHtml)
      };
      onSaved?.(savedPage);
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 space-y-8 bg-white min-h-screen relative pb-32">
      {/* Title Block */}
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="w-full text-5xl font-black border-none outline-none placeholder-gray-200 text-gray-900"
        placeholder="Page Title"
      />

      {/* Dynamic Blocks */}
      <div className="space-y-6">
        {blocks.map((block) => (
          <div key={block.id} className="group relative">
            <div className="absolute -left-12 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
              <button onClick={() => removeBlock(block.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                <BsTrash size={18} />
              </button>
            </div>

            {block.type === 'text' && (
              <TiptapEditor 
                content={block.content} 
                onChange={(html) => updateBlock(block.id, html)} 
              />
            )}

            {block.type === 'code' && (
              <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                <div className="bg-gray-800 px-4 py-2 flex justify-between items-center">
                  <select 
                    value={block.metadata?.language}
                    onChange={(e) => updateBlock(block.id, block.content, { language: e.target.value })}
                    className="bg-transparent text-white text-xs font-bold outline-none cursor-pointer"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="typescript">TypeScript</option>
                    <option value="java">Java</option>
                    <option value="python">Python</option>
                  </select>
                </div>
                <Editor
                  height="200px"
                  language={block.metadata?.language || 'javascript'}
                  value={block.content}
                  theme="vs-dark"
                  onChange={(v) => updateBlock(block.id, v)}
                  options={{ 
                    minimap: { enabled: false }, 
                    fontSize: 14,
                    scrollBeyondLastLine: false,
                    padding: { top: 10, bottom: 10 }
                  }}
                />
              </div>
            )}

            {block.type === 'drawing' && (
              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                <CanvasPad width={700} height={300} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Block Toolbar - Floating */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-xl border border-gray-200 shadow-2xl rounded-full px-8 py-4 flex gap-8 items-center z-50 transition-all hover:scale-105">
        <button onClick={() => addBlock('text')} className="flex flex-col items-center gap-1 text-[10px] font-black text-gray-500 hover:text-blue-600 transition-colors uppercase tracking-widest">
          <BsPlusCircle size={20} /> Text
        </button>
        <button onClick={() => addBlock('code')} className="flex flex-col items-center gap-1 text-[10px] font-black text-gray-500 hover:text-indigo-600 transition-colors uppercase tracking-widest">
          <BsCode size={20} /> Code
        </button>
        <button onClick={() => addBlock('drawing')} className="flex flex-col items-center gap-1 text-[10px] font-black text-gray-500 hover:text-pink-600 transition-colors uppercase tracking-widest">
          <BsPencil size={20} /> Draw
        </button>
        <div className="w-px h-8 bg-gray-200 mx-2" />
        <button 
          onClick={savePage} 
          className="bg-blue-600 text-white px-8 py-2.5 rounded-full font-black text-sm shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all active:scale-95"
        >
          SAVE NOTE
        </button>
      </div>
    </div>
  );
};

export default PageEditor;
