import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { notebookApi } from "../api";
// import { type PageDTO } from "../types";
import NewTiptapEditor from "../Components/Editor/NewTiptapEditor";
import PageViewer from "../Components/PageViewer";
import { Button, Card, Input, Skeleton } from "../Components/ui/Primitives";
import { convertHtmlToMarkdown, downloadMarkdown, convertMarkdownToHtml } from "../utils/markdownExport";
import { BsDownload, BsUpload } from "react-icons/bs";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

const NewTiptapPageContainer: React.FC = () => {
  const { notebookId, pageId } = useParams<{ notebookId: string; pageId: string }>();
  const { activeNotebook } = useSelector((state: RootState) => state.notebook);
  const navigate = useNavigate();
  
  const accentColor = useMemo(() => {
    return activeNotebook?.color || '#8b5cf6';
  }, [activeNotebook]);
  // const [page, setPage] = useState<PageDTO | null>(null);
  const [title, setTitle] = useState("Untitled");
  const [contentHtml, setContentHtml] = useState("");
  const [loading, setLoading] = useState(!!pageId);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(!pageId);
  const [drawings, setDrawings] = useState<string[]>([]);
  const [codeBlocks, setCodeBlocks] = useState<{ language: string; code: string }[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [charts, setCharts] = useState<any[]>([]);

  useEffect(() => {
    if (notebookId && pageId) {
      setLoading(true);
      notebookApi.getPage(parseInt(notebookId), parseInt(pageId))
        .then(r => { 
          const data = r.data;
          // setPage(data);
          setTitle(data.title || "Untitled");
          setContentHtml(data.contentHtml || "");
          setDrawings(data.drawings || []);
          setCodeBlocks(data.codeBlocks || []);
          setImages(data.images || []);
          setCharts(data.charts || []);
          setIsEditing(false);
        })
        .catch(err => {
          console.error("Failed to fetch page", err);
        })
        .finally(() => setLoading(false));
    } else {
      // Clear state for new page
      setTitle("Untitled");
      setContentHtml("");
      setDrawings([]);
      setCodeBlocks([]);
      setImages([]);
      setCharts([]);
      setIsEditing(true);
      setLoading(false);
    }
  }, [notebookId, pageId]);

  const handleSave = async () => {
    if (!notebookId) return;
    
    setSaving(true);
    try {
      const payload = {
        title,
        contentHtml,
        drawings,
        codeBlocks,
        images,
        charts,
      };

      let res;
      if (pageId) {
        res = await notebookApi.updatePage(parseInt(notebookId), parseInt(pageId), payload);
      } else {
        res = await notebookApi.addPage(parseInt(notebookId), payload);
      }

      if (!pageId && res.data.id) {
        navigate(`/notebooks/${notebookId}/pages/${res.data.id}`, { replace: true });
      }
      
      setIsEditing(false);
      alert("Page saved successfully!");
    } catch (err: any) {
      console.error("Save failed:", err);
      const errorMsg = err.response?.data?.message || err.message || "Unknown error";
      alert(`Failed to save page: ${errorMsg}`);
    } finally {
      setSaving(false);
    }
  };

  const handleExportMarkdown = () => {
    const markdown = convertHtmlToMarkdown(title, contentHtml);
    downloadMarkdown(title || "untitled-page", markdown);
  };

  const handleImportMarkdown = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const html = convertMarkdownToHtml(text);
      
      // Extract title from the first line if it starts with #
      const lines = text.split('\n');
      if (lines[0].startsWith('# ')) {
        setTitle(lines[0].replace('# ', '').trim());
      } else {
        setTitle(file.name.replace('.md', ''));
      }
      
      setContentHtml(html);
      setIsEditing(true);
    };
    reader.readAsText(file);
  };

  if (loading) {
    return (
      <div 
        className="notebook-container min-h-screen"
        style={{ 
          '--accent-color': accentColor,
          '--accent-color-light': `${accentColor}15`,
        } as React.CSSProperties}
      >
        <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
          <Card className="space-y-4 p-6">
            <Skeleton className="h-12 w-3/4" style={{ backgroundColor: 'var(--accent-color-light)' }} />
            <Skeleton className="h-5 w-40" style={{ backgroundColor: 'var(--accent-color-light)' }} />
          </Card>
          <Card className="space-y-4 p-6">
            <Skeleton className="h-14 w-full" style={{ backgroundColor: 'var(--accent-color-light)' }} />
            <Skeleton className="h-96 w-full rounded-[28px]" style={{ backgroundColor: 'var(--accent-color-light)' }} />
          </Card>
        </div>
      </div>
    );
  }

  // return (
  //   <div className="min-h-screen bg-white">
  //     {/* Header / Top Bar */}
  //     <div className="max-w-5xl mx-auto px-6 pt-8 flex justify-between items-end gap-4">
  //       <input
  //         value={title}
  //         onChange={e => setTitle(e.target.value)}
  //         className="flex-1 text-5xl font-black border-none outline-none placeholder-gray-200 text-gray-900 bg-transparent"
  //         placeholder="Page Title"
  //       />
  //       <button
  //         onClick={handleSave}
  //         disabled={saving}
  //         className={`px-8 py-3 rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 ${
  //           saving 
  //             ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
  //             : "bg-blue-600 text-white hover:bg-blue-700"
  //         }`}
  //       >
  //         {saving ? "Saving..." : "Save Page"}
  //       </button>
  //     </div>

  //     {/* Editor Area */}
  //     <div className="mt-8">
  //       <NewTiptapEditor 
  //         content={contentHtml} 
  //         onChange={(html) => setContentHtml(html)} 
  //       />
  //     </div>
  //   </div>
  // );
 return (
  <div 
      className="notebook-container min-h-screen"
      style={{ 
        '--accent-color': accentColor,
        '--accent-color-light': `${accentColor}15`, // 15% opacity for backgrounds
      } as React.CSSProperties}
    >
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <Card className="overflow-hidden p-6 sm:p-8" glow>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="w-full space-y-3">
            {/* <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-600 dark:text-violet-300"> */}
            <p 
              className="text-xs font-semibold uppercase tracking-[0.22em]" 
              style={{ color: 'var(--accent-color)' }}
            >
              Notebook Page
            </p>
            {isEditing ? (
              <Input
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="h-auto border-none bg-transparent px-0 text-3xl font-semibold tracking-tight shadow-none ring-0 focus:ring-0 sm:text-5xl"
                placeholder="Page Title"
                autoFocus
              />
            ) : (
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl">
                {title || "Untitled"}
              </h1>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 mr-4 border-r border-slate-200 dark:border-zinc-800 pr-4">
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
                <div className="inline-flex items-center gap-2 h-9 px-3 text-sm font-medium rounded-2xl bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white transition-colors">
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

            <div className="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:bg-slate-900 dark:text-slate-400">
              {saving ? "Saving..." : isEditing ? "Editing mode" : "Viewing mode"}
            </div>
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                size="lg"
                style={{ backgroundColor: 'var(--accent-color)', borderColor: 'var(--accent-color)' }}
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
                  style={{ backgroundColor: 'var(--accent-color)', borderColor: 'var(--accent-color)' }}
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
          <NewTiptapEditor 
            content={contentHtml} 
            onChange={(data) => {
              setContentHtml(data.html); 
              setDrawings(data.drawings); 
              setCodeBlocks(data.codeBlocks);
              setImages(data.images);
              // setCharts(data.charts || []);
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

export default NewTiptapPageContainer;