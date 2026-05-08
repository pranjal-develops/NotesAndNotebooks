import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef } from 'react';

interface DrawingCanvasProps {
  initialData?: string | null;
}

export interface CanvasHandle {
  getSaveData: () => string;
  clear: () => void;
}

const DrawingCanvas = forwardRef<CanvasHandle, DrawingCanvasProps>(({ initialData }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#8b5cf6'); // Default purple
  const [brushSize, setBrushSize] = useState(5);
  const [tool, setTool] = useState<'pencil' | 'eraser'>('pencil');

  // Expose methods to parent components (like Add or EditPopUp)
  useImperativeHandle(ref, () => ({
    getSaveData: () => {
      return canvasRef.current?.toDataURL() || '';
    },
    clear: () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Make canvas responsive to its container
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = 300; // Fixed height for the drawing area
        
        // If we have initial data (editing a note), draw it back
        if (initialData) {
          const img = new Image();
          img.onload = () => ctx.drawImage(img, 0, 0);
          img.src = initialData;
        }
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [initialData]);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    } else {
      return {
        x: e.nativeEvent.offsetX,
        y: e.nativeEvent.offsetY
      };
    }
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      setIsDrawing(true);
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  return (
    <div className="flex flex-col gap-3 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 p-2 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setTool('pencil')}
            className={`p-2 rounded-md ${tool === 'pencil' ? 'bg-purple-100 text-purple-600' : 'text-gray-500'}`}
          >
            ✏️
          </button>
          <button
            type="button"
            onClick={() => setTool('eraser')}
            className={`p-2 rounded-md ${tool === 'eraser' ? 'bg-purple-100 text-purple-600' : 'text-gray-500'}`}
          >
            🧽
          </button>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-8 h-8 p-0 border-none rounded cursor-pointer"
          />
        </div>
        
        <div className="flex items-center gap-2 flex-1 max-w-[150px]">
          <span className="text-xs text-gray-500">Size</span>
          <input
            type="range"
            min="1"
            max="20"
            value={brushSize}
            onChange={(e) => setBrushSize(parseInt(e.target.value))}
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
          />
        </div>

        <button
          type="button"
          onClick={() => {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');
            if (ctx && canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);
          }}
          className="text-xs font-medium text-red-500 hover:text-red-600 px-2"
        >
          Clear
        </button>
      </div>

      {/* Canvas */}
      <div className="relative bg-white rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden touch-none">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="cursor-crosshair w-full"
        />
      </div>
    </div>
  );
});

DrawingCanvas.displayName = 'DrawingCanvas';

export default DrawingCanvas;