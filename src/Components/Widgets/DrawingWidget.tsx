import { NodeViewWrapper } from '@tiptap/react';
import DrawingCanvas from '../common/Canvas';
import { BsTrash } from 'react-icons/bs';

const DrawingWidget = ({ node, updateAttributes, deleteNode, editor }: any) => {
  const { width, height, dataUrl } = node.attrs;
  const isEditable = editor.isEditable;

  const updateWidth = (delta: number) => {
    updateAttributes({ width: Math.min(1200, Math.max(300, width + delta)) });
  };

  if (!isEditable) {
    return (
      <NodeViewWrapper className="drawing-widget my-6">
        <div 
          className="mx-auto overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-zinc-800 dark-island:border-zinc-800 dark:bg-zinc-950 dark-island:bg-zinc-950"
          style={{ maxWidth: '100%', width: width }}
        >
          {dataUrl ? (
            <img 
              src={dataUrl} 
              alt="Drawing" 
              className="w-full h-auto block"
            />
          ) : (
            <div className="flex h-32 items-center justify-center text-slate-400 italic">
              Empty Drawing
            </div>
          )}
        </div>
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper className="drawing-widget my-6 group relative">
      {/* Widget Controls */}
      <div className="absolute -top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
        {/* Width Controls */}
        <div className="flex bg-white shadow-lg rounded-full border border-zinc-200 overflow-hidden items-center px-1">
          <span className="text-[10px] font-bold text-zinc-400 px-1">W</span>
          <button 
            onClick={() => updateWidth(-50)}
            className="px-2 py-1 text-xs font-bold hover:bg-zinc-100 border-r border-zinc-200"
            title="Narrower"
          >
            -
          </button>
          <button 
            onClick={() => updateWidth(50)}
            className="px-2 py-1 text-xs font-bold hover:bg-zinc-100"
            title="Wider"
          >
            +
          </button>
        </div>

        {/* Height Controls */}
        {/* <div className="flex bg-white shadow-lg rounded-full border border-zinc-200 overflow-hidden items-center px-1">
          <span className="text-[10px] font-bold text-zinc-400 px-1">H</span>
          <button 
            onClick={() => updateHeight(-50)}
            className="px-2 py-1 text-xs font-bold hover:bg-zinc-100 border-r border-zinc-200"
            title="Shorter"
          >
            -
          </button>
          <button 
            onClick={() => updateHeight(50)}
            className="px-2 py-1 text-xs font-bold hover:bg-zinc-100"
            title="Taller"
          >
            +
          </button>
        </div> */}
        <button 
          onClick={deleteNode}
          className="p-2 bg-white shadow-lg rounded-full text-red-600 hover:bg-red-50 border border-red-100"
          title="Remove Drawing"
        >
          <BsTrash size={14} />
        </button>
      </div>

      {/* The Canvas Area */}
      <div className="bg-zinc-50 rounded-3xl border-2 border-dashed border-zinc-200 p-6 transition-colors hover:border-blue-200 hover:bg-blue-50/30 inline-block">
        <div className="flex flex-col items-center gap-4" style={{ width: width }}>
          {/* <CanvasPad 
            ref={canvasRef} 
            width={width} 
            height={height} 
            defaultColor="#3b82f6" 
            defaultSize={4} 
            onSave={(dataUrl) => updateAttributes({ dataUrl })}
          /> */}
          <DrawingCanvas 
            initialData={dataUrl}
            width={width} 
            initialHeight={height} 
            onSave={(url) => updateAttributes({ dataUrl: url })}
          />
        </div>
      </div>
    </NodeViewWrapper>
  );
};

export default DrawingWidget;