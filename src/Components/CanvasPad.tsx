import React, {
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useState,
  type MouseEvent,
  type TouchEvent
} from "react";

export type Stroke = {
  points: { x: number; y: number }[];
  color: string;
  size: number;
};

export type CanvasPadHandle = {
  exportImage: () => string; // dataURL
  loadImage: (dataUrl: string) => Promise<void>;
  undo: () => void;
  redo: () => void;
  clear: () => void;
};

type Props = {
  width?: number;
  height?: number;
  backgroundColor?: string;
  initialStrokes?: Stroke[];
  defaultColor?: string;
  defaultSize?: number;
  style?: React.CSSProperties;
};

const devicePixelRatioSafe = () => (typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1);

const CanvasPad = forwardRef<CanvasPadHandle, Props>((props, ref) => {
  const {
    width = 800,
    height = 400,
    backgroundColor = "transparent",
    initialStrokes = [],
    defaultColor = "#000000",
    defaultSize = 3,
    style
  } = props;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);
  const strokesRef = useRef<Stroke[]>([...initialStrokes]);
  const undoneRef = useRef<Stroke[]>([]);
  const colorRef = useRef<string>(defaultColor);
  const sizeRef = useRef<number>(defaultSize);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  // Setup canvas with DPR scaling
  useEffect(() => {
    const cvs = canvasRef.current!;
    const dpr = devicePixelRatioSafe();
    cvs.width = Math.round(width * dpr);
    cvs.height = Math.round(height * dpr);
    cvs.style.width = `${width}px`;
    cvs.style.height = `${height}px`;
    const ctx = cvs.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D context not available");
    ctx.scale(dpr, dpr);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctxRef.current = ctx;
    redrawAll();
  }, [width, height]);

  // expose imperative API
  useImperativeHandle(ref, () => ({
    exportImage: () => {
      const cvs = canvasRef.current!;
      return cvs.toDataURL("image/png");
    },
    loadImage: (dataUrl: string) =>
      new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          const ctx = ctxRef.current!;
          // draw image onto a fresh canvas backing store and add as a stroke
          ctx.save();
          ctx.globalCompositeOperation = "source-over";
          ctx.drawImage(img, 0, 0, width, height);
          ctx.restore();
          // push a special stroke representing the raster layer (single point with data)
          strokesRef.current.push({
            points: [],
            color: "__raster__:" + dataUrl,
            size: 0
          });
          undoneRef.current = [];
          resolve();
        };
        img.onerror = (e) => reject(e);
        img.src = dataUrl;
      }),
    undo: () => {
      const s = strokesRef.current.pop();
      if (s) {
        undoneRef.current.push(s);
        redrawAll();
      }
    },
    redo: () => {
      const s = undoneRef.current.pop();
      if (s) {
        strokesRef.current.push(s);
        redrawAll();
      }
    },
    clear: () => {
      strokesRef.current = [];
      undoneRef.current = [];
      const ctx = ctxRef.current!;
      ctx.clearRect(0, 0, width, height);
      if (backgroundColor && backgroundColor !== "transparent") {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);
      }
    }
  }));

  // helpers
  const getPointFromEvent = (e: MouseEvent | TouchEvent) => {
    const cvs = canvasRef.current!;
    const rect = cvs.getBoundingClientRect();
    if ("touches" in e) {
      const t = e.touches[0];
      return { x: t.clientX - rect.left, y: t.clientY - rect.top };
    } else {
      return { x: (e as MouseEvent).clientX - rect.left, y: (e as MouseEvent).clientY - rect.top };
    }
  };

  const beginStroke = (p: { x: number; y: number }) => {
    const stroke: Stroke = { points: [p], color: colorRef.current, size: sizeRef.current };
    setCurrentStroke(stroke);
    lastPosRef.current = p;
    setIsDrawing(true);
    undoneRef.current = []; // clear redo stack
  };

  const pushPoint = (p: { x: number; y: number }) => {
    setCurrentStroke(prev => {
      if (!prev) return prev;
      const next = { ...prev, points: [...prev.points, p] };
      // draw incremental segment
      drawStrokeSegment(prev, p);
      return next;
    });
    lastPosRef.current = p;
  };

  const endStroke = () => {
    setIsDrawing(false);
    if (currentStroke) {
      strokesRef.current.push(currentStroke);
      setCurrentStroke(null);
    }
    lastPosRef.current = null;
  };

  const drawStrokeSegment = (fromStroke: Stroke, nextPoint: { x: number; y: number }) => {
    const ctx = ctxRef.current!;
    const pts = fromStroke.points;
    const last = pts[pts.length - 1];
    if (!last) return;
    ctx.save();
    ctx.strokeStyle = fromStroke.color;
    ctx.lineWidth = fromStroke.size;
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(nextPoint.x, nextPoint.y);
    ctx.stroke();
    ctx.restore();
  };

  const redrawAll = () => {
    const ctx = ctxRef.current!;
    ctx.clearRect(0, 0, width, height);
    if (backgroundColor && backgroundColor !== "transparent") {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);
    }
    for (const s of strokesRef.current) {
      if (s.color.startsWith("__raster__:")) {
        // raster layer
        const dataUrl = s.color.replace("__raster__:", "");
        const img = new Image();
        // draw synchronously may fail if image not ready; draw when loaded
        // we create a closure to draw after load
        img.onload = (() => {
          const drawImg = () => ctx.drawImage(img, 0, 0, width, height);
          return drawImg;
        })();
        img.src = dataUrl;
        continue;
      }
      if ((s.points ?? []).length === 1) {
        // dot
        ctx.save();
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.points[0].x, s.points[0].y, s.size / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        continue;
      }
      ctx.save();
      ctx.strokeStyle = s.color;
      ctx.lineWidth = s.size;
      ctx.beginPath();
      for (let i = 0; i < s.points.length; i++) {
        const p = s.points[i];
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
      ctx.restore();
    }
  };

  // mouse handlers
  const onMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const p = getPointFromEvent(e);
    beginStroke(p);
  };
  const onMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const p = getPointFromEvent(e);
    pushPoint(p);
  };
  const onMouseUp = () => {
    if (!isDrawing) return;
    endStroke();
  };

  // touch handlers
  const onTouchStart = (e: TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const p = getPointFromEvent(e);
    beginStroke(p);
  };
  const onTouchMove = (e: TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const p = getPointFromEvent(e);
    pushPoint(p);
  };
  const onTouchEnd = () => {
    if (!isDrawing) return;
    endStroke();
  };

  // public setters for color/size via refs
  const setColor = (c: string) => {
    colorRef.current = c;
  };
  const setSize = (s: number) => {
    sizeRef.current = s;
  };

  // Provide optional UI controls when needed (you may omit in pure component)
  return (
    <div style={{ display: "inline-block", position: "relative", ...style }}>
      <canvas
        ref={canvasRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{ touchAction: "none", background: backgroundColor, display: "block" }}
      />
    </div>
  );
});

export default CanvasPad;
