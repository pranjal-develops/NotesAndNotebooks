import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input, IconButton, Surface } from './ui/Primitives';
import { BsX, BsGripVertical, BsFileEarmarkText, BsImage } from 'react-icons/bs';
import { IoColorPalette } from 'react-icons/io5';
import { LuNotebookPen } from 'react-icons/lu';
import type { Notebook, PageSummary } from '../types';

interface NotebookDetailsProps {
  notebook: Notebook;
  onClose: () => void;
  onUpdateNotebook?: (data: Partial<Notebook>) => void;
  onReorderPages?: (pageIds: number[]) => void;
}

const NotebookDetails: React.FC<NotebookDetailsProps> = ({
  notebook,
  onClose,
  onUpdateNotebook,
  onReorderPages,
}) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedNotebook, setEditedNotebook] = useState(notebook);
  const [draggedPage, setDraggedPage] = useState<PageSummary | null>(null);

  // Initialize with ordered pages based on pageOrder
  const [pages, setPages] = useState(
    [...(notebook.pages || [])].sort((a, b) => (a.pageOrder || 0) - (b.pageOrder || 0))
  );

  // Drag and Drop Handlers
  const handleDragStart = (page: PageSummary) => {
    setDraggedPage(page);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetPage: PageSummary) => {
    if (!draggedPage) return;

    const updatedPages = [...pages];
    const draggedIndex = updatedPages.findIndex(p => p.id === draggedPage.id);
    const targetIndex = updatedPages.findIndex(p => p.id === targetPage.id);

    if (draggedIndex !== targetIndex) {
      // Remove from source
      updatedPages.splice(draggedIndex, 1);
      // Insert at target
      updatedPages.splice(targetIndex, 0, draggedPage);
      
      setPages(updatedPages);
      // Notify parent of new order
      onReorderPages?.(updatedPages.map(p => p.id));
    }
    setDraggedPage(null);
  };

  const handleSave = () => {
    onUpdateNotebook?.(editedNotebook);
    setIsEditing(false);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const logo = event.target?.result as string;
      setEditedNotebook(prev => ({ ...prev, logo }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-zinc-800">
          <div className="flex items-center gap-4">
            {isEditing ? (
              <label className="cursor-pointer">
                <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                <div className="w-16 h-16 rounded-[24px] border-2 border-dashed border-slate-300 dark:border-zinc-700 flex items-center justify-center hover:border-violet-400 transition-colors bg-slate-50 dark:bg-zinc-950">
                  {editedNotebook.logo ? (
                    <img
                      src={editedNotebook.logo}
                      alt="Notebook logo"
                      className="w-12 h-12 rounded-xl object-contain"
                    />
                  ) : (
                    <BsImage size={24} className="text-slate-400" />
                  )}
                </div>
              </label>
            ) : (
              <div
                className="w-16 h-16 rounded-[24px] flex items-center justify-center"
                style={{ backgroundColor: editedNotebook.color || '#8b5cf6', opacity: 0.2 }}
              >
                {editedNotebook.logo ? (
                  <img
                    src={editedNotebook.logo}
                    alt="Notebook logo"
                    className="w-12 h-12 rounded-xl object-contain"
                  />
                ) : (
                  <LuNotebookPen size={32} style={{ color: editedNotebook.color || '#8b5cf6' }} />
                )}
              </div>
            )}
            <div>
              {isEditing ? (
                <Input
                  value={editedNotebook.name}
                  onChange={(e) => setEditedNotebook(prev => ({ ...prev, name: e.target.value }))}
                  className="text-2xl font-bold h-auto p-0 border-none shadow-none ring-0 focus:ring-0"
                />
              ) : (
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {notebook.name}
                </h2>
              )}
              <p className="text-sm text-slate-500 dark:text-zinc-400">
                {notebook.pages?.length || 0} {notebook.pages?.length === 1 ? 'page' : 'pages'}
              </p>
            </div>
          </div>
          <IconButton onClick={onClose} variant="ghost">
            <BsX size={20} />
          </IconButton>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Description & Settings */}
          <section className="space-y-4">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                    Description
                  </label>
                  <textarea
                    value={editedNotebook.description || ''}
                    onChange={(e) => setEditedNotebook(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full min-h-[100px] p-4 bg-slate-50 dark:bg-zinc-950 rounded-2xl border border-slate-200 dark:border-zinc-800 focus:ring-2 focus:ring-violet-500/20 outline-none resize-vertical"
                    placeholder="Add a description..."
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block flex items-center gap-2">
                    <IoColorPalette size={14} /> Color
                  </label>
                  <div className="flex gap-3 flex-wrap">
                    {['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#6366f1'].map((color) => (
                      <button
                        key={color}
                        onClick={() => setEditedNotebook(prev => ({ ...prev, color }))}
                        className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                          editedNotebook.color === color ? 'border-slate-900 dark:border-white' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : notebook.description && (
              <Surface className="p-4">
                <p className="text-sm text-slate-600 dark:text-zinc-300">
                  {notebook.description}
                </p>
              </Surface>
            )}

            <div className="flex justify-end gap-3">
              {isEditing ? (
                <>
                  <Button variant="ghost" onClick={() => { setIsEditing(false); setEditedNotebook(notebook); }}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  Edit Notebook
                </Button>
              )}
            </div>
          </section>

          {/* Pages List */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                Pages
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/notebooks/${notebook.id}/pages/create`)}
              >
                + New Page
              </Button>
            </div>

            <div className="space-y-2">
              {pages.map((page) => (
                <div
                  key={page.id}
                  draggable
                  onDragStart={() => handleDragStart(page)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(page)}
                  className={`group flex items-center gap-3 p-3 rounded-2xl border border-transparent hover:border-slate-200 dark:hover:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-950/50 transition-colors ${
                    draggedPage?.id === page.id ? 'opacity-50' : 'opacity-100'
                  }`}
                >
                  <div className="cursor-grab active:cursor-grabbing text-slate-400 group-hover:text-slate-600">
                    <BsGripVertical size={18} />
                  </div>
                  <BsFileEarmarkText size={18} className="text-violet-400" />
                  <button
                    onClick={() => {
                      navigate(`/notebooks/${notebook.id}/pages/${page.id}`);
                      onClose();
                    }}
                    className="flex-1 text-left text-sm font-medium text-slate-900 dark:text-white hover:text-violet-600 transition-colors"
                  >
                    {page.title || 'Untitled'}
                  </button>
                </div>
              ))}

              {pages.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                  <p className="text-sm">No pages yet</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2"
                    onClick={() => navigate(`/notebooks/${notebook.id}/pages/create`)}
                  >
                    Create your first page
                  </Button>
                </div>
              )}
            </div>
          </section>
        </div>
      </Card>
    </div>
  );
};

export default NotebookDetails;