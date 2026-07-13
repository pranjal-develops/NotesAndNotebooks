import { useEffect, useRef, useState } from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import mermaid from 'mermaid';

// Initialize mermaid with professional settings
mermaid.initialize({
  startOnLoad: false,
  theme: 'neutral',
  securityLevel: 'loose',
  fontFamily: 'Inter, sans-serif',
});

const ChartWidget = ({ node, updateAttributes, deleteNode }: any) => {
  const [code, setCode] = useState(node.attrs.code);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const renderChart = async () => {
    if (!previewRef.current || isEditing) return;
    
    try {
      setError(null);
      // Unique ID for each render attempt
      const id = `mermaid-svg-${Math.random().toString(36).substring(2, 9)}`;
      
      // Mermaid requires a visible container or a specific configuration to render properly
      const { svg } = await mermaid.render(id, code);
      
      if (previewRef.current) {
        previewRef.current.innerHTML = svg;
      }
    } catch (err) {
      console.error("Mermaid rendering failed", err);
      setError("Invalid chart syntax. Please check your Mermaid code.");
      if (previewRef.current) {
        previewRef.current.innerHTML = ""; // Clear on error
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      renderChart();
    }, 100); // Small delay to ensure DOM is ready
    return () => clearTimeout(timer);
  }, [code, isEditing]);

  const handleBlur = () => {
    updateAttributes({ code });
    setIsEditing(false);
  };

  return (
    <NodeViewWrapper className="chart-widget my-8 group relative">
      {/* Action Toolbar */}
      <div className="absolute -top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="px-3 py-1 bg-white shadow-lg rounded-full text-xs font-bold text-violet-600 hover:bg-violet-50 border border-violet-100"
        >
          {isEditing ? "View Chart" : "Edit Code"}
        </button>
        <button 
          onClick={deleteNode}
          className="p-2 bg-white shadow-lg rounded-full text-red-600 hover:bg-red-50 border border-red-100"
        >
          🗑️
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-sm">
        <div className="bg-slate-50 dark:bg-zinc-950 px-6 py-3 border-b border-slate-200 dark:border-zinc-800 flex justify-between items-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Flowchart / Diagram</span>
          {error && <span className="text-[10px] font-bold text-red-500 uppercase">{error}</span>}
        </div>

        <div className="p-6" ref={containerRef}>
          {isEditing ? (
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onBlur={handleBlur}
              autoFocus
              className="w-full h-48 font-mono text-sm p-4 bg-slate-50 dark:bg-zinc-950 rounded-xl border-none outline-none focus:ring-2 focus:ring-violet-500/20 transition-all resize-y"
              placeholder="Enter Mermaid code..."
            />
          ) : (
            <div 
              ref={previewRef} 
              className="flex justify-center items-center min-h-[100px] overflow-x-auto py-4 mermaid-preview"
            />
          )}
        </div>
      </div>
    </NodeViewWrapper>
  );
};

export default ChartWidget;