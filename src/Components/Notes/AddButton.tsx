import { useEffect, useRef, useState } from "react";
import { BsPlusLg } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { AddDrawingTrue, AddNoteTrue } from "../../store/slice/noteSlice";

const AddButton = () => {
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const onDocMouseDown = (e: MouseEvent) => {
      const el = wrapperRef.current;
      if (!el) return;

      if (!el.contains(e.target as Node)) setOpen(false);
    };

    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [open]);

  return (
    <div ref={wrapperRef} className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-14 h-14 md:w-16 md:h-16
                   rounded-full bg-purple-600 text-white
                   shadow-lg hover:shadow-purple-500/50
                   flex items-center justify-center
                   transition-all hover:scale-110 active:scale-95"
      >
        <BsPlusLg size={24} />
      </button>

      {open && (
  <div
    className="absolute bottom-full right-0 mb-3 w-44 origin-bottom-right
               animate-[popout_180ms_ease-out_forwards]"
  >
    <style>
      {`
        @keyframes popout {
          from { opacity: 0; transform: translateY(8px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}
    </style>

    <div className="bg-white dark:bg-zinc-900 dark-island:bg-zinc-900 border border-gray-200 dark:border-zinc-700 dark-island:border-zinc-700 pitch-black:border-zinc-700 pitch-black:bg-black rounded-xl shadow-lg p-2">
      <button
        type="button"
        onClick={() => {
          dispatch(AddNoteTrue());
          setOpen(false);
        }}
        className="w-full text-left px-3 py-2 rounded-lg hover:bg-purple-50 dark:hover:bg-zinc-800 dark-island:hover:bg-zinc-800 pitch-black:hover:bg-zinc-800 text-gray-800 dark:text-zinc-100 dark-island:text-zinc-100 pitch-black:text-white"
      >
        Add Note
      </button>

      <button
        type="button"
        onClick={() => {
          dispatch(AddDrawingTrue());
          setOpen(false);
        }}
        className="w-full text-left px-3 py-2 rounded-lg hover:bg-purple-50 dark:hover:bg-zinc-800 dark-island:hover:bg-zinc-800 pitch-black:hover:bg-zinc-800 text-gray-800 dark:text-zinc-100 dark-island:text-zinc-100 pitch-black:text-white mt-1"
      >
        Add Drawing
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default AddButton;
