import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { notebookApi } from "../api";
import { type PageDTO } from "../types";
import NewTiptapEditor from "./Editor/NewTiptapEditor";
import { Button, Card, Input, Skeleton } from "./ui/Primitives";

const NewTiptapPageContainer: React.FC = () => {
  const { notebookId, pageId } = useParams<{ notebookId: string; pageId: string }>();
  const navigate = useNavigate();
  
  const [page, setPage] = useState<PageDTO | null>(null);
  const [title, setTitle] = useState("Untitled");
  const [contentHtml, setContentHtml] = useState("");
  const [loading, setLoading] = useState(!!pageId);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (notebookId && pageId) {
      setLoading(true);
      notebookApi.getPage(parseInt(notebookId), parseInt(pageId))
        .then(r => { 
          const data = r.data;
          setPage(data);
          setTitle(data.title || "Untitled");
          setContentHtml(data.contentHtml || "");
        })
        .catch(err => {
          console.error("Failed to fetch page", err);
        })
        .finally(() => setLoading(false));
    }
  }, [notebookId, pageId]);

  const handleSave = async () => {
    if (!notebookId) return;
    
    setSaving(true);
    try {
      const payload = {
        title,
        contentHtml,
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
      
      alert("Page saved successfully!");
    } catch (err) {
      console.error("Save failed", err);
      alert("Failed to save page.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
        <Card className="space-y-4 p-6">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-5 w-40" />
        </Card>
        <Card className="space-y-4 p-6">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-96 w-full rounded-[28px]" />
        </Card>
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
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <Card className="overflow-hidden p-6 sm:p-8" glow>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="w-full space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-600 dark:text-violet-300">
              Notebook Page
            </p>
            <Input
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="h-auto border-none bg-transparent px-0 text-3xl font-semibold tracking-tight shadow-none ring-0 focus:ring-0 sm:text-5xl"
              placeholder="Page Title"
            />
            {/* <p className="text-sm text-slate-500 dark:text-slate-400">
              Rich text, code blocks, drawings, and inline formatting are available in the editor below.
            </p> */}
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:bg-slate-900 dark:text-slate-400">
              {saving ? "Saving..." : pageId ? "Ready to save" : "New page"}
            </div>
            <Button
              onClick={handleSave}
              disabled={saving}
              size="lg"
            >
              {saving ? "Saving..." : "Save Page"}
            </Button>
          </div>
        </div>
      </Card>
      <Card className="overflow-hidden">
        <NewTiptapEditor 
          content={contentHtml} 
          onChange={(html) => setContentHtml(html)} 
        />
      </Card>
    </div>
  );

};

export default NewTiptapPageContainer;