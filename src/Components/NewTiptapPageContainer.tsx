import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { notebookApi } from "../api";
import { type PageDTO } from "../types";
import NewTiptapEditor from "./Editor/NewTiptapEditor";

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
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium">Loading editor...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header / Top Bar */}
      <div className="max-w-5xl mx-auto px-6 pt-8 flex justify-between items-end gap-4">
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="flex-1 text-5xl font-black border-none outline-none placeholder-gray-200 text-gray-900 bg-transparent"
          placeholder="Page Title"
        />
        <button
          onClick={handleSave}
          disabled={saving}
          className={`px-8 py-3 rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 ${
            saving 
              ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {saving ? "Saving..." : "Save Page"}
        </button>
      </div>

      {/* Editor Area */}
      <div className="mt-8">
        <NewTiptapEditor 
          content={contentHtml} 
          onChange={(html) => setContentHtml(html)} 
        />
      </div>
    </div>
  );
};

export default NewTiptapPageContainer;