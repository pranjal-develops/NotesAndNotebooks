import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../../store/store";
import { setNotes, setSelectedTag, setViewingDrawings } from "../../../../store/slice/noteSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { BsSticky } from "react-icons/bs";
import type { DrawingDto } from "../../../../types";
import { api } from "../../../../api";

const DrawingSections = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { notes, selectedTag } = useSelector((state: RootState) => state.note);

  // const drawings = notes.filter((n) => n.isDrawing || n.drawing);
  const drawings = notes.filter((n) => n.drawing);

  const allTags = Array.from(new Set(drawings.flatMap((note) => note.tags || [])));

  const handleAllDrawingsClick = async () => {
    dispatch(setViewingDrawings(true));
    try {
      const response = await api.get(`/notes/drawings`);

      const fetchedDrawings = response.data.map((d: DrawingDto) => ({
        id: d.id,
        title: "",
        description: "",
        drawingData: d.drawingData,
        color: d.color,
        pinned: d.pinned,
        tags: d.tags,
        isDrawing: true,
        drawing: true,
      }));

      dispatch(setNotes(fetchedDrawings));
    } catch (error) {
      console.error("Failed to fetch drawings:", error);
    }
  };

  const handleTagClick = (tag: string | null) => {
    dispatch(setViewingDrawings(true));
    dispatch(setSelectedTag(tag));

    if (location.pathname !== "/notes") {
      navigate("/notes");
    }
  };

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between px-2 mb-2 text-xs font-semibold text-zinc-500 uppercase tracking-[0.22em] dark:text-slate-400 dark-island:text-slate-400 pitch-black:text-slate-400">
        <span>Drawings</span>
        <span className="rounded-full bg-slate-200/70 px-2.5 py-1 text-[11px] text-zinc-600 dark:bg-zinc-800 dark-island:bg-zinc-800 dark:text-slate-300 dark-island:text-slate-300 pitch-black:bg-zinc-800 pitch-black:text-slate-300">
          {drawings.length}
        </span>
      </div>

      <div className="space-y-2">
        <button
          onClick={async () => {
            await handleAllDrawingsClick();
            handleTagClick(null);
          }}
          className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-xl transition-all group cursor-pointer ${selectedTag === null
            ? "bg-(--accent-color-light) text-(--accent-color)"
            : "text-zinc-600 dark:text-zinc-400 dark-island:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 dark-island:hover:bg-zinc-800 pitch-black:hover:bg-zinc-800 pitch-black:text-zinc-400"
            }`}
        >
          <span
            className={`text-(--accent-color) transition-opacity ${selectedTag === null ? "opacity-100" : "opacity-50 group-hover:opacity-100"
              }`}
          >
            <BsSticky />
          </span>
          <span className="flex-1 text-left tracking-wide">All Drawings</span>
          <span className="rounded-full bg-black/5 px-2 py-0.5 text-[11px] dark:bg-white/10 dark-island:bg-white/10 pitch-black:bg-white/10">
            {drawings.length}
          </span>
        </button>

        {allTags.length > 0 &&
          allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-xl transition-all group cursor-pointer ${selectedTag === tag
                ? "bg-(--accent-color-light) text-(--accent-color)"
                : "text-zinc-600 dark:text-zinc-400 dark-island:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 dark-island:hover:bg-zinc-800 pitch-black:hover:bg-zinc-800"
                }`}
            >
              <span
                className={`text-(--accent-color) transition-opacity ${selectedTag === tag ? "opacity-100" : "opacity-50 group-hover:opacity-100"
                  }`}
              >
                <BsSticky />
              </span>
              <span className="truncate tracking-wide">{tag}</span>
            </button>
          ))}
      </div>
    </section>
  );
};

export default DrawingSections;
