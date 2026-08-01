import axios from "axios";
import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { AddDrawingFalse } from "../../store/slice/noteSlice";
import DrawingCanvas, { type CanvasHandle } from "../common/Canvas";
// import { BsPinAngleFill } from "react-icons/bs";
import type { Note as note } from "../../types";
import { IoIosSave, IoMdClose } from "react-icons/io";
import { useHandleEvents } from "../../hooks/useHandleEvents";
import { BsPinAngleFill } from "react-icons/bs";

// interface CreateDrawingProps {
//   onCreateDrawing: (
//     note: note,
//     meta?: { tempId?: number; shouldRemove?: boolean },
//   ) => void;
// }

interface CreateDrawingProps {
  note?: note | null;
  onClose?: () => void;
  onToggleDrawing?: (isDrawing: boolean) => void;
}

const COLORS = [
  { name: "Default", value: "transparent" },
  { name: "Red", value: "#f28b82" },
  { name: "Orange", value: "#fbbc04" },
  { name: "Yellow", value: "#fff475" },
  { name: "Green", value: "#ccff90" },
  { name: "Teal", value: "#a7ffeb" },
  { name: "Blue", value: "#cbf0f8" },
  { name: "Dark Blue", value: "#aecbfa" },
  { name: "Purple", value: "#d7aefb" },
  { name: "Pink", value: "#fdcfe8" },
];

const CreateDrawing: React.FC<CreateDrawingProps> = ({
  note,
  onClose,
  onToggleDrawing,
}) => {
  const dispatch = useDispatch();
  const [isClosing, setIsClosing] = useState(false);
  const [color, setColor] = useState("transparent");
  const [pinned, setPinned] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const { handleOptimisticAdd } = useHandleEvents();
  const { handleUpdate } = useHandleEvents();

  const CreateDrawingTag = (e: React.KeyboardEvent) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().replace(",", " ");
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const canvasRef = useRef<CanvasHandle>(null);

  const handleSubmit = async () => {
    const drawingData = canvasRef.current?.getSaveData();
    if (note) {
      const updatedNote = {
        ...note,
        drawingData,
        color,
        pinned,
        tags,
        isDrawing: true,
      };
      handleUpdate(updatedNote);
      closePopup();
      try {
        await axios.put(
          `${import.meta.env.VITE_API_BASE}/notes/${note.id}`,
          updatedNote,
        );
      } catch (error) {
        console.error(error);
      }
    } else {
      const tempId = -Date.now();
      const optimisticNote = {
        id: tempId,
        title: "",
        description: "",
        drawingData,
        color,
        pinned,
        tags,
        isOptimistic: true,
        drawing: true,
      };
      handleOptimisticAdd(optimisticNote);
      closePopup();
      try {
        const { id: _, ...noteDataWithoutId } = optimisticNote;
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE}/notes`,
          noteDataWithoutId,
        );
        handleOptimisticAdd(response.data, { tempId });
      } catch (error) {
        handleOptimisticAdd(optimisticNote, { shouldRemove: true });
        console.log(error);
      }
    }
  };

  const closePopup = () => {
    setIsClosing(true);
    setTimeout(() => {
      if (onClose) onClose();
      else dispatch(AddDrawingFalse());
      setIsClosing(false);
    }, 200);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isClosing ? "animate-out fade-out duration-200" : "animate-in fade-in duration-200"}`}
    >
      <button
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={closePopup}
      />

      <div
        className={`w-full h-full 
  /* Mobile: Slides from bottom, rounded only at top */
  fixed bottom-0 left-0 right-0 rounded-t-3xl 
  /* Desktop: Centered */
  md:relative md:bottom-auto md:rounded-2xl 
  
  bg-white dark:bg-zinc-900 dark-island:bg-zinc-900 shadow-2xl overflow-hidden transform transition-all duration-300 md:duration-150 ease-out
  ${isClosing ? "translate-y-full md:translate-y-0 md:scale-95 md:opacity-0" : "translate-y-0 md:scale-100 md:opacity-100"}`}
        style={{
          backgroundColor: color !== "transparent" ? color : undefined,
        }}
      >
        {/* Drag Handle for Mobile */}
        <div className="w-12 h-1.5 bg-zinc-300 dark:bg-zinc-700  dark-island:bg-zinc-700 rounded-full mx-auto mt-3 mb-1 md:hidden" />
        <div className="flex-col">
          <div className="sticky top-0 z-10 pl-6 pt-4 flex items-center justify-between ">
            <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-700/80 dark:text-white/80 dark-island:text-white/80">
              Drawing
            </h2>
            <div className="hidden md:flex justify-evenly items-center w-full mx-12">
              <div className="flex flex-wrap gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setColor(c.value)}
                    className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${color === c.value
                      ? "border-(--accent-color) scale-110"
                      : "border-transparent"
                      }`}
                    style={{
                      backgroundColor:
                        c.value === "transparent" ? "white" : c.value,
                    }}
                    title={c.name}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => setPinned(!pinned)}
                className={`p-2 rounded-full transition-colors ${pinned
                  ? "text-purple-600 bg-purple-50"
                  : "text-zinc-400 hover:bg-zinc-100"
                  }`}
              >
                <BsPinAngleFill size={20} />
              </button>
              <div className="mx-2 flex flex-row items-center gap-2">
                <label className="text-xs font-semibold text-zinc-500 uppercase">Tags</label>
                <div className="flex flex-wrap gap-2 p-2 border border-zinc-100 dark:border-zinc-800 dark-island:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-800/40 dark-island:bg-zinc-800/40 dark:text-white/50 dark-island:text-white/50">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 px-2 py-1 bg-(--accent-color-light) text-(--accent-color) rounded-md text-xs"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:opacity-70"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={CreateDrawingTag}
                    placeholder="Add tag..."
                    className="flex-1 bg-transparent outline-none text-xs"
                  />
                </div>
              </div>

              {/* Toggle Option */}
              {note && onToggleDrawing && (
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={note?.drawing || note?.drawing || false}
                      onChange={(e) => onToggleDrawing(e.target.checked)}
                      className="sr-only peer"
                    />
                    {/* Switch Track */}
                    <div className="w-10 h-6 bg-zinc-300 dark:bg-zinc-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-purple-500/20 peer-checked:bg-purple-600 transition-colors duration-200" />
                    {/* Switch Knob */}
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 peer-checked:translate-x-4" />
                  </div>
                  <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                    Drawing Mode
                  </span>
                </label>
              )}
            </div>
            <div className="flex flex-row">
              <button
                onClick={handleSubmit}
                className="text-zinc-400 hover:text-zinc-500 dark:hover:text-zinc-300 transition-colors mx-1 px-1 text-xl"
              >
                <IoIosSave />
              </button>
              <button
                onClick={closePopup}
                className="text-zinc-400 hover:text-zinc-500 dark:hover:text-zinc-300 transition-colors mx-1 px-1 text-xl"
              >
                <IoMdClose />
              </button>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 max-h-[90vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800">
              <div className="pt-2">
                {/* <div className="mt-3 animate-in slide-in-from-top-2 duration-200">
                  <DrawingCanvas ref={canvasRef} />
                </div> */}
                {/* Toggle Option */}

                {/* Drawing Canvas Container */}
                <div className="w-[95%] h-[90%] mx-auto mt-3 animate-in slide-in-from-top-2 duration-200">
                  <DrawingCanvas
                    ref={canvasRef}
                    initialData={note?.drawingData}
                    initialHeight={window.innerHeight * 0.7}
                  />
                </div>
              </div>
            </div>
          </form>
          <div className="flex flex-col md:flex-row items-center justify-evenly px-2">
            <div className="flex items-center justify-evenly px-2">
              <div className="flex items-center gap-4 py-2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateDrawing;
