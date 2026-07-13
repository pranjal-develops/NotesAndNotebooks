import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { notebookApi } from "../api";
// import PageEditor from "./PageEditor";
import { type PageDTO } from "../types";
// import PageViewer from "./PageViewer";

const PageContainer: React.FC = () => {
  const { notebookId, pageId } = useParams<{ notebookId: string; pageId: string }>();
  // const navigate = useNavigate();
  
  const [page, setPage] = useState<PageDTO | null>(null);
  const [isEditing, setIsEditing] = useState(!pageId);
  const [loading, setLoading] = useState(!!pageId);

  useEffect(() => {
    if (notebookId && pageId) {
      setLoading(true);
      notebookApi.getPage(parseInt(notebookId), parseInt(pageId))
        .then(r => { 
          setPage(r.data); 
          setIsEditing(false); 
        })
        .catch(err => {
          console.error("Failed to fetch page", err);
          setPage(null);
        })
        .finally(() => setLoading(false));
    } else {
      setPage(null);
      setIsEditing(true);
      setLoading(false);
    }
  }, [notebookId, pageId]);

  // const handleSaved = (savedPage: PageDTO) => {
  //   setPage(savedPage);
  //   setIsEditing(false);
  //   // If it was a new page, update the URL without refreshing
  //   if (!pageId && savedPage.id && notebookId) {
  //     navigate(`/notebooks/${notebookId}/pages/${savedPage.id}`, { replace: true });
  //   }
  // };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium animate-pulse">Opening your notes...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/30">
      {isEditing ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* <PageEditor 
            notebookId={parseInt(notebookId!!)} 
            page={page ?? undefined} 
            onSaved={handleSaved} 
          /> */}
        </div>
      ) : page ? (
        <div className="max-w-5xl mx-auto py-8 px-4 space-y-6 animate-in fade-in duration-700">
          <div className="flex justify-end sticky top-6 z-20">
            <button 
              onClick={() => setIsEditing(true)}
              className="group bg-white/80 backdrop-blur-md text-gray-700 border border-gray-200 px-6 py-2.5 rounded-2xl shadow-sm hover:shadow-xl hover:bg-white hover:-translate-y-0.5 transition-all duration-300 font-bold flex items-center gap-2"
            >
              <span className="text-blue-500 group-hover:rotate-12 transition-transform">✎</span> 
              Edit Content
            </button>
          </div>
          {/* <PageViewer page={page} /> */}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-gray-400">
          <span className="text-6xl mb-4">🗒️</span>
          <p className="text-lg font-medium">Select a page to start writing</p>
        </div>
      )}
    </div>
  );
};

export default PageContainer;
