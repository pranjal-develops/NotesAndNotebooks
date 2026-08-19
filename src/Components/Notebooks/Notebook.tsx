import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { notebookApi } from "../../api";
import type { PageSummary } from "../../types";
import { Button, Card, Skeleton } from "../../Components/ui/Primitives";
import { BsTrash } from "react-icons/bs";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { getGuestNotebookById } from "../../utils/guestStorage";

const Notebook = () => {
  const { notebookId } = useParams<{ notebookId: string }>();
  const [loading, setLoading] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("Notebook Name");
  const [description, setDescription] = useState<string>("Description");
  const [logo, setLogo] = useState<string | null>();
  const [pages, setPages] = useState<PageSummary[]>();
  const isGuest = useSelector((state: RootState) => state.auth.isGuest);
  useEffect(() => {
    if (notebookId) {
      setLoading(true);
      if (isGuest) {
        const notebook = getGuestNotebookById(Number.parseInt(notebookId));
        setTitle(notebook.name || "Notebook Name");
        setDescription(notebook.description || "Notebook Description");
        setLogo(notebook.logo);
        setPages(notebook.pages);
        setLoading(false);
      } else {
        notebookApi.getById(Number.parseInt(notebookId)).then((response) => {
          const data = response.data;
          setTitle(data.name || "Notebook Name");
          setDescription(data.description || "Notebook Description");
          setLogo(data.logo);
          setPages(data.pages);
          setLoading(false);
        });

      }
    }
  }, [notebookId]);

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
          ...
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <Card className="overflow-hidden p-4 sm:p-6 mb-5">
        <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            {logo && (
              <img
                src={
                  logo.startsWith("data:")
                    ? logo
                    : `data:image/png;base64,${logo}`
                }
                alt="Image"
                className="h-10 w-10 sm:h-12 sm:w-12 object-contain rounded"
              />
            )}
          </div>

          {/* Title */}
          <div className="flex-1">
            <div className="text-3xl sm:text-4xl font-bold wrap-break-word leading-tight text-center md:text-left pitch-black:text-white">
              {title}
            </div>
          </div>

          {/* Edit button */}
          <div className="flex justify-center md:justify-end">
            <Button
              size="lg"
              style={{
                backgroundColor: "var(--accent-color)",
                borderColor: "var(--accent-color)",
              }}
            >
              <Link to={`/notebooks/${notebookId}/edit`}>Edit</Link>
            </Button>
          </div>
        </div>
      </Card>

      {/* Body */}
      <Card className="overflow-hidden p-4 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-5 pitch-black:text-white">
          Description
        </h1>
        <p className="text-sm sm:text-base leading-relaxed pitch-black:text-white">{description}</p>

        {pages !== undefined && (
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold my-4 sm:my-5 pitch-black:text-white">
              Pages
            </h1>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {pages.map((p) => (
                <div
                  key={p.pageOrder}
                  className="flex items-center justify-between gap-3 bg-white dark:bg-zinc-800 dark-island:bg-zinc-800 pitch-black:bg-zinc-800 px-4 py-2 rounded-xl border-2 border-zinc-50 dark:border-zinc-700 dark-island:border-zinc-700 pitch-black:border-zinc-700 group animate-in slide-in-from-left-2 duration-200"
                >
                  <span className="text-zinc-700 dark:text-zinc-300 dark-island:text-zinc-300 pitch-black:text-zinc-300 flex items-center gap-3 min-w-0">
                    <span className="text-xs font-mono text-zinc-400 shrink-0">
                      {p.pageOrder + 1}.
                    </span>

                    {/* Prevent long titles from overflowing */}
                    <Link
                      to={`/notebooks/${notebookId}/pages/${p.id}`}
                      className="truncate block"
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
    </>
  );
};

export default Notebook;
