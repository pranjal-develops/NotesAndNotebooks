import { NodeViewWrapper } from '@tiptap/react';
import React, { useRef } from 'react';
import CanvasPad, { type CanvasPadHandle } from '../CanvasPad';
import { BsTrash, BsDownload } from 'react-icons/bs';

const DrawingWidget = ({ node, updateAttributes, deleteNode }: any) => {
  const canvasRef = useRef<CanvasPadHandle | null>(null);
  const { width, height } = node.attrs;

  const handleExport = () => {
    const dataUrl = canvasRef.current?.exportImage();
    if (dataUrl) {
      updateAttributes({ dataUrl });
      alert("Drawing captured! It will be saved with the note.");
    }
  };

  const updateWidth = (delta: number) => {
    updateAttributes({ width: Math.min(1200, Math.max(300, width + delta)) });
  };

  const updateHeight = (delta: number) => {
    updateAttributes({ height: Math.min(1000, Math.max(200, height + delta)) });
  };

  return (
    <NodeViewWrapper className="drawing-widget my-6 group relative">
      {/* Widget Controls */}
      <div className="absolute -top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
        {/* Width Controls */}
        <div className="flex bg-white shadow-lg rounded-full border border-gray-200 overflow-hidden items-center px-1">
          <span className="text-[10px] font-bold text-gray-400 px-1">W</span>
          <button 
            onClick={() => updateWidth(-50)}
            className="px-2 py-1 text-xs font-bold hover:bg-gray-100 border-r border-gray-200"
            title="Narrower"
          >
            -
          </button>
          <button 
            onClick={() => updateWidth(50)}
            className="px-2 py-1 text-xs font-bold hover:bg-gray-100"
            title="Wider"
          >
            +
          </button>
        </div>

        {/* Height Controls */}
        <div className="flex bg-white shadow-lg rounded-full border border-gray-200 overflow-hidden items-center px-1">
          <span className="text-[10px] font-bold text-gray-400 px-1">H</span>
          <button 
            onClick={() => updateHeight(-50)}
            className="px-2 py-1 text-xs font-bold hover:bg-gray-100 border-r border-gray-200"
            title="Shorter"
          >
            -
          </button>
          <button 
            onClick={() => updateHeight(50)}
            className="px-2 py-1 text-xs font-bold hover:bg-gray-100"
            title="Taller"
          >
            +
          </button>
        </div>
        <button 
          onClick={handleExport}
          className="p-2 bg-white shadow-lg rounded-full text-blue-600 hover:bg-blue-50 border border-blue-100"
          title="Capture Drawing"
        >
          <BsDownload size={14} />
        </button>
        <button 
          onClick={deleteNode}
          className="p-2 bg-white shadow-lg rounded-full text-red-600 hover:bg-red-50 border border-red-100"
          title="Remove Drawing"
        >
          <BsTrash size={14} />
        </button>
      </div>

      {/* The Canvas Area */}
      <div className="bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 p-6 transition-colors hover:border-blue-200 hover:bg-blue-50/30 inline-block">
        <div className="flex flex-col items-center gap-4" style={{ width: width }}>
          <CanvasPad 
            ref={canvasRef} 
            width={width} 
            height={height} 
            defaultColor="#3b82f6" 
            defaultSize={4} 
          />
          
          {node.attrs.dataUrl && (
            <div className="w-full mt-4 pt-4 border-t border-gray-200">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Last Captured Preview:</p>
              <img 
                src={node.attrs.dataUrl} 
                alt="Captured Drawing" 
                className="h-20 rounded-lg border border-gray-200 bg-white" 
              />
            </div>
          )}
        </div>
      </div>
    </NodeViewWrapper>
  );
};

export default DrawingWidget;