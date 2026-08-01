import React from "react";
import TiptapEditor from "../Editor/TiptapEditor";
import PageViewer from "../PageViewer";
import { Button, Card, Input, Skeleton } from "../ui/Primitives";
import { BsDownload, BsUpload } from "react-icons/bs";
import { useNotebookPage } from "../../hooks/useNotebookPage";

const PageContainer: React.FC = () => {
  const {
    pageId,
    title,
    setTitle,
    contentHtml,
    setContentHtml,
    loading,
    saving,
    isEditing,
    setIsEditing,
    handleSave,
    handleExportMarkdown,
    handleImportMarkdown,
  } = useNotebookPage();

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
    <div className="notebook-container min-h-screen">
      <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
        <Card className="overflow-hidden p-6 sm:p-8" glow>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="w-full space-y-3">
              <p
                className="text-xs font-semibold uppercase tracking-[0.22em]"
                style={{ color: "var(--accent-color)" }}
              >
                Notebook Page
              </p>
              {isEditing ? (
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-auto border-none bg-transparent px-0 text-3xl font-semibold tracking-tight shadow-none ring-0 focus:ring-0 sm:text-5xl"
                  placeholder="Page Title"
                  autoFocus
                />
              ) : (
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 dark-island:text-slate-100 pitch-black:text-slate-100 sm:text-5xl">
                  {title || "Untitled"}
                </h1>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 mr-4 border-r border-slate-200 dark:border-zinc-800 dark-island:border-zinc-800 pitch-black:border-zinc-800 pr-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleExportMarkdown}
                  title="Export to Markdown"
                >
                  <BsDownload className="w-4 h-4" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
                <label className="cursor-pointer">
                  <div className="inline-flex items-center gap-2 h-9 px-3 text-sm font-medium rounded-2xl bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark-island:text-slate-300 pitch-black:text-slate-300 dark:hover:bg-slate-800 dark-island:hover:bg-slate-800 pitch-black:hover:bg-slate-800 dark:hover:text-white dark-island:hover:text-white pitch-black:hover:text-white transition-colors">
                    <BsUpload className="w-4 h-4" />
                    <span className="hidden sm:inline">Import</span>
                  </div>
                  <input
                    type="file"
                    accept=".md"
                    className="hidden"
                    onChange={handleImportMarkdown}
                  />
                </label>
              </div>

              <div className="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:bg-slate-900 dark-island:bg-slate-900 pitch-black:bg-slate-900 dark:text-slate-400 dark-island:text-slate-400 pitch-black:text-slate-400">
                {saving
                  ? "Saving..."
                  : isEditing
                    ? "Editing mode"
                    : "Viewing mode"}
              </div>
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  size="lg"
                  style={{
                    backgroundColor: "var(--accent-color)",
                    borderColor: "var(--accent-color)",
                  }}
                >
                  Edit Page
                </Button>
              ) : (
                <div className="flex gap-2">
                  {pageId && (
                    <Button
                      onClick={() => setIsEditing(false)}
                      variant="ghost"
                      size="lg"
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                  )}
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    size="lg"
                    style={{
                      backgroundColor: "var(--accent-color)",
                      borderColor: "var(--accent-color)",
                    }}
                  >
                    {saving ? "Saving..." : "Save Page"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>
        <Card className="overflow-hidden">
          {isEditing ? (
            <TiptapEditor
              content={contentHtml}
              onChange={(data) => {
                setContentHtml(data.html);
              }}
            />
          ) : (
            <PageViewer content={contentHtml} />
          )}
        </Card>
      </div>
    </div>
  );
};

export default PageContainer;
