import { useEffect, useRef, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { notebookApi } from "../../api";
import type { PageSummary } from "../../types";
import { Button, Card, Input, Skeleton, Textarea } from "../ui/Primitives";
import { BsTrash } from "react-icons/bs";
import type { RootState } from "../../store/store";
import { useSelector, useDispatch } from "react-redux";
import {
  setActiveNotebook,
  setNotebooks,
} from "../../store/slice/notebookSlice";
import { getGuestNotebookById, updateGuestNotebook, getGuestNotebooks } from "../../utils/guestStorage";

// Inside EditNotebook component, alongside other hooks:


const EditNotebook = () => {
  const { notebookId } = useParams<{ notebookId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { activeNotebook } = useSelector((state: RootState) => state.notebook);
  const isGuest = useSelector((state: RootState) => state.auth.isGuest);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("Notebook Name");
  const [description, setDescription] = useState<string>("Description");
  const [logo, setLogo] = useState<string | null>();
  const [color, setColor] = useState<string>("#8b5cf6");
  const [initialColor, setInitialColor] = useState<string>("");
  const [pages, setPages] = useState<PageSummary[]>();

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    // Swap the order of pages locally
    const updatedPages = [...(pages || [])];
    const draggedItem = updatedPages[draggedIndex];
    updatedPages.splice(draggedIndex, 1);
    updatedPages.splice(index, 0, draggedItem);

    setDraggedIndex(index);
    setPages(updatedPages);
  };

  const handleDragEnd = async () => {
    setDraggedIndex(null);
    if (!notebookId || !pages) return;
    try {
      if (isGuest) {
        const notebook = getGuestNotebookById(parseInt(notebookId));
        if (notebook) {
          notebook.pages = pages.map((p, index) => ({ ...p, pageOrder: index }));
          updateGuestNotebook(notebook);
        }
      } else {
        const pageIds = pages.map((p) => p.id);
        await notebookApi.reorderPages(parseInt(notebookId), { pageIds });
      }
    } catch (error) {
      console.error("Failed to persist page order:", error);
    }
  };


  const PRESETS = [
    { name: "Purple", value: "#8b5cf6" },
    { name: "Blue", value: "#3b82f6" },
    { name: "Green", value: "#10b981" },
    { name: "Yellow", value: "#f59e0b" },
    { name: "Red", value: "#ef4444" },
    { name: "Pink", value: "#ec4899" },
  ];

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    if (activeNotebook) {
      dispatch(setActiveNotebook({ ...activeNotebook, color: newColor }));
    }
  };

  const handleSave = async () => {
    if (!notebookId) return;
    setIsSaving(true);
    try {
      const payload = {
        name: title,
        description,
        color,
        logo: logo || "",
      };

      if (isGuest) {
        const notebook = getGuestNotebookById(parseInt(notebookId));
        if (notebook) {
          const updatedNotebook = { ...notebook, ...payload };
          updateGuestNotebook(updatedNotebook);
          dispatch(setActiveNotebook(updatedNotebook));
          dispatch(setNotebooks(getGuestNotebooks()));
        }
        navigate(`/notebooks/${notebookId}`);
      } else {
        const response = await notebookApi.updateNotebook(parseInt(notebookId), payload);
        dispatch(setActiveNotebook(response.data));
        const listResponse = await notebookApi.getAll();
        dispatch(setNotebooks(listResponse.data));
        navigate(`/notebooks/${notebookId}`);
      }
    } catch (error) {
      console.error("Failed to save notebook:", error);
      alert("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };


  useEffect(() => {
    if (notebookId) {
      setLoading(true);
      if (isGuest) {
        const notebook = getGuestNotebookById(parseInt(notebookId));
        if (notebook) {
          setTitle(notebook.name || "Notebook Name");
          setDescription(notebook.description || "Notebook Description");
          setLogo(notebook.logo);
          setColor(notebook.color || "#8b5cf6");
          setInitialColor(notebook.color || "#8b5cf6");
          setPages(notebook.pages);
        }
        setLoading(false);
      } else {
        notebookApi.getById(parseInt(notebookId)).then((response) => {
          const data = response.data;
          setTitle(data.name || "Notebook Name");
          setDescription(data.description || "Notebook Description");
          setLogo(data.logo);
          setColor(data.color || "#8b5cf6");
          setInitialColor(data.color || "#8b5cf6");
          setPages(data.pages);
          setLoading(false);
        });
      }
    }
  }, [notebookId, isGuest]);


  // Create refs to hold the latest values
  const isSavingRef = useRef(isSaving);
  const activeNotebookRef = useRef(activeNotebook);
  const initialColorRef = useRef(initialColor);

  // Sync refs with the latest state values on every render
  useEffect(() => {
    isSavingRef.current = isSaving;
    activeNotebookRef.current = activeNotebook;
    initialColorRef.current = initialColor;
  }, [isSaving, activeNotebook, initialColor]);

  // Cleanup effect: Runs ONLY on unmount
  useEffect(() => {
    return () => {
      // Revert site-wide accent color if user exits/cancels without saving
      if (
        !isSavingRef.current &&
        activeNotebookRef.current &&
        initialColorRef.current
      ) {
        dispatch(
          setActiveNotebook({
            ...activeNotebookRef.current,
            color: initialColorRef.current,
          }),
        );
      }
    };
  }, [dispatch]);

  if (loading) {
    return (
      <div className="notebook-container min-h-screen">
        <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
          <Card className="space-y-4 p-6">
            <Skeleton
              className="h-12 w-3/4"
              style={{ backgroundColor: "var(--accent-color-light)" }}
            />
            <Skeleton
              className="h-5 w-40"
              style={{ backgroundColor: "var(--accent-color-light)" }}
            />
          </Card>
          <Card className="space-y-4 p-6">
            <Skeleton
              className="h-14 w-full"
              style={{ backgroundColor: "var(--accent-color-light)" }}
            />
            <Skeleton
              className="h-96 w-full rounded-[28px]"
              style={{ backgroundColor: "var(--accent-color-light)" }}
            />
          </Card>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="overflow-hidden p-4 sm:p-6 mb-5">
        <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Logo Uploader */}
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 dark-island:border-zinc-700 pitch-black:border-zinc-700 flex items-center justify-center overflow-hidden bg-zinc-50 dark:bg-zinc-800 dark-island:bg-zinc-800 pitch-black:bg-zinc-800 shrink-0">
              {logo ? (
                <img
                  src={
                    logo.startsWith("data:")
                      ? logo
                      : `data:image/png;base64,${logo}`
                  }
                  alt="Logo Preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xs text-zinc-400">No Logo</span>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="logo-upload"
                className="cursor-pointer px-3 py-1.5 text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark-island:bg-zinc-800 pitch-black:bg-zinc-800 dark:hover:bg-zinc-700 dark-island:hover:bg-zinc-700 pitch-black:hover:bg-zinc-700 rounded-xl transition-colors text-center text-zinc-700 dark:text-zinc-300 dark-island:text-zinc-300 pitch-black:text-zinc-300"
              >
                Upload Logo
              </label>
              <input
                type="file"
                id="logo-upload"
                accept="image/*"
                className="hidden"
                onChange={handleLogoChange}
              />
              {logo && (
                <button
                  type="button"
                  onClick={() => setLogo("")} // Use empty string to signal removal
                  className="px-3 py-1.5 text-xs font-semibold text-red-500 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark-island:bg-red-950/30 pitch-black:bg-red-950/30 dark:hover:bg-red-900/30 dark-island:hover:bg-red-900/30 pitch-black:hover:bg-red-900/30 rounded-xl transition-colors"
                >
                  Remove Logo
                </button>
              )}
            </div>
          </div>

          {/* Title */}
          <div className="flex-1">
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-3xl sm:text-4xl w-full font-bold wrap-break-word leading-tight text-center md:text-left"
            />
          </div>

          {/* Edit button */}
          <div className="flex justify-center md:justify-end">
            <Button
              onClick={handleSave}
              size="lg"
              style={{
                backgroundColor: "var(--accent-color)",
                borderColor: "var(--accent-color)",
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </Card>

      {/* Body */}
      <Card className="overflow-hidden p-4 sm:p-8">
        {/* Color Selector */}
        <div className="space-y-3 mb-8 pb-6 border-b border-zinc-100 dark:border-zinc-800 dark-island:border-zinc-800 pitch-black:border-zinc-800">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Theme Color
          </label>
          <div className="flex flex-wrap items-center gap-4">
            {PRESETS.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => handleColorChange(c.value)}
                className={`w-10 h-10 rounded-xl transition-all transform hover:scale-110 ${color === c.value
                    ? "ring-4 ring-(--accent-color)/30 scale-110 border-2 border-white dark:border-zinc-900 dark-island:border-zinc-900 pitch-black:border-zinc-900 shadow-md"
                    : "border border-zinc-200 dark:border-zinc-700 dark-island:border-zinc-700 pitch-black:border-zinc-700"
                  }`}
                style={{ backgroundColor: c.value }}
                title={c.name}
              />
            ))}
            {/* Custom Color Picker */}
            <div className="relative w-10 h-10 rounded-xl border border-zinc-200 dark:border-zinc-700 dark-island:border-zinc-700 pitch-black:border-zinc-700 overflow-hidden flex items-center justify-center bg-zinc-50 dark:bg-zinc-800 dark-island:bg-zinc-800 pitch-black:bg-zinc-800 hover:scale-110 transition-transform">
              <input
                type="color"
                value={color}
                onChange={(e) => handleColorChange(e.target.value)}
                className="absolute inset-0 w-full h-full p-0 border-0 cursor-pointer opacity-0"
              />
              <span className="text-lg">🎨</span>
            </div>
          </div>
        </div>
        {/* ... remaining textarea ... */}

        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-5 pitch-black:text-white">
          Description
        </h1>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full h-40 p-5 bg-white dark:bg-zinc-800 dark-island:bg-zinc-800 pitch-black:bg-zinc-800 rounded-xl border-2 border-zinc-50 dark:border-zinc-700 dark-island:border-zinc-700 pitch-black:border-zinc-700"
        />

        {pages !== undefined && (
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold my-4 sm:my-5 pitch-black:text-white">
              Pages
            </h1>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {pages.map((p, index) => (
                <div
                  key={p.id || p.pageOrder}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center justify-between gap-3 bg-white dark:bg-zinc-800 dark-island:bg-zinc-800 pitch-black:bg-zinc-800 px-4 py-2 rounded-xl border-2 border-zinc-50 dark:border-zinc-700 dark-island:border-zinc-700 pitch-black:border-zinc-700 group cursor-grab active:cursor-grabbing transition-all duration-200 ${draggedIndex === index
                      ? "opacity-40 border-dashed border-(--accent-color)"
                      : ""
                    }`}
                >
                  <span className="text-zinc-700 dark:text-zinc-300 dark-island:text-zinc-300 pitch-black:text-zinc-300 flex items-center gap-3 min-w-0 pointer-events-none">
                    <span className="text-xs font-mono text-zinc-400 shrink-0">
                      {index + 1}.
                    </span>
                    <Link
                      to={`/notebooks/${notebookId}/pages/${p.id}`}
                      className="truncate block pointer-events-auto hover:text-(--accent-color)"
                      title={p.title}
                    >
                      {p.title}
                    </Link>
                  </span>

                  <button
                    type="button"
                    className="text-zinc-400 hover:text-red-500 transition-colors p-1 shrink-0"
                  >
                    <BsTrash size={14} />
                  </button>
                </div>
              ))}

              {pages.length === 0 && (
                <p className="text-sm text-zinc-400 italic text-center py-4 border-2 border-dashed border-zinc-100 dark:border-zinc-800 dark-island:border-zinc-800 pitch-black:border-zinc-800 rounded-xl">
                  No pages added yet.
                </p>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default EditNotebook;
