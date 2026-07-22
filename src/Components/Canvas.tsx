import React, {
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";

interface DrawingCanvasProps {
  initialData?: string | null;
  onSave?: (data: string) => void;
  initialHeight?: number;
  width?: number;
}

export interface CanvasHandle {
  getSaveData: () => string;
  clear: () => void;
}

const DrawingCanvas = forwardRef<CanvasHandle, DrawingCanvasProps>(
  ({ initialData, onSave, initialHeight = 300, width }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState("#8b5cf6");
    const [brushSize, setBrushSize] = useState(5);
    const [tool, setTool] = useState<"pencil" | "eraser">("pencil");
    const [canvasHeight, setCanvasHeight] = useState(initialHeight);
    const [isResizing, setIsResizing] = useState(false);

    // Track last point + pointerId so mouse/touch/pen are consistent
    const activePointerIdRef = useRef<number | null>(null);
    const lastPointRef = useRef<{ x: number; y: number } | null>(null);

    // ---------- Canvas sizing (DPR-aware) ----------
    const resizeCanvasToContainer = (opts?: { preserveDrawing?: boolean }) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const container = canvas.parentElement;
      const cssW = width || container?.clientWidth || 800;
      const cssH = canvasHeight;

      const prev = opts?.preserveDrawing ? canvas.toDataURL() : null;

      const dpr = Math.max(1, window.devicePixelRatio || 1);

      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);

      // Draw in CSS pixels
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;

      // Restore content if needed
      if (prev) {
        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, cssW, cssH);
          ctx.drawImage(img, 0, 0, cssW, cssH);
        };
        img.src = prev;
      }

      // If initialData exists and we didn't preserve previous content
      if (initialData && !prev) {
        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, cssW, cssH);
          ctx.drawImage(img, 0, 0, cssW, cssH);
        };
        img.src = initialData;
      }
    };

    useEffect(() => {
      resizeCanvasToContainer({ preserveDrawing: false });

      const onResize = () => resizeCanvasToContainer({ preserveDrawing: true });
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [canvasHeight, width]);

    // Expose methods to parent components (like Add or EditPopUp)
    useImperativeHandle(ref, () => ({
      getSaveData: () => canvasRef.current?.toDataURL() || "",
      clear: () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (ctx && canvas) {
          const cssW = canvas.style.width
            ? parseFloat(canvas.style.width)
            : canvas.width;
          const cssH = canvas.style.height
            ? parseFloat(canvas.style.height)
            : canvas.height;
          ctx.clearRect(0, 0, cssW, cssH);
          if (onSave) onSave("");
        }
      },
    }));

    // ---------- Pointer coordinates (pen/mouse/touch) ----------
    const getCanvasPointFromEvent = (
      e: React.PointerEvent<HTMLCanvasElement>
    ) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      return { x, y };
    };

    const getStrokeWidthFromEvent = (
      e: React.PointerEvent<HTMLCanvasElement>
    ) => {
      // pressure: 0..1 (0 for non-contact). Fallback for mouse/touch.
      const pressure =
        e.pressure && e.pressure > 0 ? e.pressure : 0.5;
      const scaled = brushSize * (0.5 + pressure);
      return Math.max(1, scaled);
    };

    const applyStrokeStyle = (
      ctx: CanvasRenderingContext2D,
      e: React.PointerEvent<HTMLCanvasElement>
    ) => {
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      if (tool === "eraser") {
        ctx.globalCompositeOperation = "destination-out";
        ctx.strokeStyle = "rgba(0,0,0,1)";
      } else {
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = color;
      }

      ctx.lineWidth = getStrokeWidthFromEvent(e);
    };

    // ---------- Drawing handlers (Pointer Events) ----------
    const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;

      if (e.cancelable) e.preventDefault();
      e.stopPropagation();

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      activePointerIdRef.current = e.pointerId;
      lastPointRef.current = getCanvasPointFromEvent(e);

      setIsDrawing(true);

      try {
        canvas.setPointerCapture(e.pointerId);
      } catch {
        // ignore
      }

      const p = lastPointRef.current!;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      applyStrokeStyle(ctx, e);
    };

    const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDrawing) return;
      if (activePointerIdRef.current !== e.pointerId) return;

      if (e.cancelable) e.preventDefault();
      e.stopPropagation();

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      const p = getCanvasPointFromEvent(e);
      const last = lastPointRef.current;

      // Draw segment
      ctx.beginPath();
      if (last) ctx.moveTo(last.x, last.y);
      else ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x, p.y);

      applyStrokeStyle(ctx, e);
      ctx.stroke();

      lastPointRef.current = p;
    };

    const stopDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (activePointerIdRef.current !== e.pointerId) return;

      if (e.cancelable) e.preventDefault();
      e.stopPropagation();

      setIsDrawing(false);
      activePointerIdRef.current = null;
      lastPointRef.current = null;

      const canvas = canvasRef.current;
      if (onSave && canvas) onSave(canvas.toDataURL());
    };

    // ---------- Resizing handle (Pointer Events) ----------
    const handleResizePointerDown = (
      e: React.PointerEvent<HTMLDivElement>
    ) => {
      if (e.cancelable) e.preventDefault();
      e.stopPropagation();
      setIsResizing(true);

      try {
        (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    };

    const handleResizePointerMove = (
      e: React.PointerEvent<HTMLDivElement>
    ) => {
      if (!isResizing || !canvasRef.current) return;

      const clientY = e.clientY;
      const rect = canvasRef.current.getBoundingClientRect();
      const newHeight = Math.max(150, clientY - rect.top);
      setCanvasHeight(newHeight);
    };

    const handleResizePointerUp = (
      e: React.PointerEvent<HTMLDivElement>
    ) => {
      if (!isResizing) return;

      if (e.cancelable) e.preventDefault();
      e.stopPropagation();

      setIsResizing(false);
      const canvas = canvasRef.current;
      if (onSave && canvas) onSave(canvas.toDataURL());
    };

    return (
      <div className="flex flex-col gap-3 p-2 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700">
        <div className="flex items-center justify-between gap-4 p-2 bg-white dark:bg-zinc-900 rounded-lg shadow-sm">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTool("pencil")}
              className={`p-2 rounded-md ${
                tool === "pencil"
                  ? "bg-purple-100 text-purple-600"
                  : "text-zinc-500"
              }`}
            >
              ✏️
            </button>
            <button
              type="button"
              onClick={() => setTool("eraser")}
              className={`p-2 rounded-md ${
                tool === "eraser"
                  ? "bg-purple-100 text-purple-600"
                  : "text-zinc-500"
              }`}
            >
              🧽
            </button>
            <input
              type="color"
              value={color}
              onChange={(ev) => setColor(ev.target.value)}
              className="w-8 h-8 p-0 border-none rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-2 flex-1 max-w-[150px]">
            <span className="text-xs text-zinc-500">Size</span>
            <input
              type="range"
              min="1"
              max="20"
              value={brushSize}
              onChange={(ev) =>
                setBrushSize(parseInt(ev.target.value, 10))
              }
              className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              const canvas = canvasRef.current;
              const ctx = canvas?.getContext("2d");
              if (ctx && canvas) {
                const cssW = canvas.style.width
                  ? parseFloat(canvas.style.width)
                  : canvas.width;
                const cssH = canvas.style.height
                  ? parseFloat(canvas.style.height)
                  : canvas.height;
                ctx.clearRect(0, 0, cssW, cssH);
                if (onSave) onSave("");
              }
            }}
            className="text-xs font-medium text-red-500 hover:text-red-600 px-2"
          >
            Clear
          </button>
        </div>

        <div className="relative bg-white rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden touch-none">
          <canvas
            ref={canvasRef}
            className="cursor-crosshair w-full touch-none select-none"
            onPointerDown={startDrawing}
            onPointerMove={draw}
            onPointerUp={stopDrawing}
            onPointerCancel={stopDrawing}
            onPointerLeave={stopDrawing}
          />

          <div
            onPointerDown={handleResizePointerDown}
            onPointerMove={handleResizePointerMove}
            onPointerUp={handleResizePointerUp}
            onPointerCancel={handleResizePointerUp}
            className="h-3 w-full bg-zinc-100 dark:bg-zinc-800 hover:bg-purple-200 dark:hover:bg-purple-900/50 cursor-ns-resize flex items-center justify-center transition-colors group touch-none select-none"
          >
            <div className="w-12 h-1 bg-zinc-300 dark:bg-zinc-600 rounded-full group-hover:bg-purple-400 transition-colors" />
          </div>
        </div>
      </div>
    );
  }
);

DrawingCanvas.displayName = "DrawingCanvas";
export default DrawingCanvas;
