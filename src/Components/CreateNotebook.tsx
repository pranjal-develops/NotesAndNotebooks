import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setNotebooks } from '../store/slice/notebookSlice';
import { SetTempAccentColor } from '../store/slice/uiSlice';
import { notebookApi } from '../api';
import { BsArrowLeft, BsJournalText, BsPlusLg, BsTrash } from 'react-icons/bs';
import { Link, useNavigate } from "react-router-dom"

const COLORS = [
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Green', value: '#10b981' },
  { name: 'Yellow', value: '#f59e0b' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Pink', value: '#ec4899' },
];

const CreateNotebook = () => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(COLORS[0].value);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pageTitle, setPageTitle] = useState("");
  const [pendingPages, setPendingPages] = useState<string[]>([]);
  const navigate = useNavigate();

  // Keep Redux tempAccentColor in sync with local selected color state
  useEffect(() => {
    dispatch(SetTempAccentColor(color));

    // Cleanup on unmount: Reset the temp accent color in Redux
    return () => {
      dispatch(SetTempAccentColor(null));
    };
  }, [color, dispatch]);

  const addPendingPage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (pageTitle.trim()) {
      setPendingPages([...pendingPages, pageTitle.trim()]);
      setPageTitle("");
    }
  };

  const removePendingPage = (index: number) => {
    setPendingPages(pendingPages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload = {
      name,
      description,
      color,
      pages: pendingPages.map((title, index) => ({
        title,
        pageOrder: index
      }))
    };

    setIsSubmitting(true);
    try {
      await notebookApi.createNotebook(payload);
      const response = await notebookApi.getAll();
      dispatch(setNotebooks(response.data));
      navigate("/notes")
    } catch (error) {
      console.error("Failed to create notebook", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="max-w-4xl mx-auto py-12 px-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
      style={{
        '--accent-color': color,
        '--accent-color-light': `${color}15`,
      } as React.CSSProperties}
    >
      <Link
        to='/notes'
        className="flex items-center gap-2 text-zinc-500 hover:text-(--accent-color) transition-colors mb-8 group"
      >
        <BsArrowLeft className="group-hover:-translate-x-1 transition-transform" />
        Back to Notes
      </Link>

      <div className="flex flex-col md:flex-row gap-12">
        <div className="flex-1">
          <h1 className="text-4xl font-black text-zinc-900 dark:text-white dark-island:text-white pitch-black:text-white mb-2">Create a Notebook</h1>
          <p className="text-zinc-500 dark:text-zinc-400 dark-island:text-zinc-400 pitch-black:text-zinc-400 mb-8">
            Notebooks are containers for your multi-page projects, chapters, and organized thoughts.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 dark-island:text-zinc-300 pitch-black:text-zinc-300 mb-2 uppercase tracking-wider">Notebook Name</label>
              <input
                autoFocus
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-6 py-4 text-lg bg-white dark:bg-zinc-800 dark-island:bg-zinc-800 pitch-black:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-700 dark-island:border-zinc-700 pitch-black:border-zinc-700 rounded-2xl focus:border-(--accent-color) outline-none transition-all dark:text-white dark-island:text-white pitch-black:text-white shadow-sm"
                placeholder="e.g. Master Thesis"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 dark-island:text-zinc-300 pitch-black:text-zinc-300 mb-2 uppercase tracking-wider">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-6 py-4 bg-white dark:bg-zinc-800 dark-island:bg-zinc-800 pitch-black:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-700 dark-island:border-zinc-700 pitch-black:border-zinc-700 rounded-2xl focus:border-(--accent-color) outline-none transition-all dark:text-white dark-island:text-white pitch-black:text-white resize-none h-32 shadow-sm"
                placeholder="What will you store in this notebook?"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 dark-island:text-zinc-300 pitch-black:text-zinc-300 mb-2 uppercase tracking-wider">Initial Pages / Chapters</label>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={pageTitle}
                  onChange={(e) => setPageTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addPendingPage();
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-white dark:bg-zinc-800 dark-island:bg-zinc-800 pitch-black:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-700 dark-island:border-zinc-700 pitch-black:border-zinc-700 rounded-xl focus:border-(--accent-color) outline-none dark:text-white dark-island:text-white pitch-black:text-white shadow-sm"
                  placeholder="e.g. Introduction"
                />
                <button
                  type="button"
                  onClick={() => addPendingPage()}
                  className="p-3 bg-(--accent-color) text-white rounded-xl hover:opacity-90 transition-colors shadow-lg shadow-(--accent-color)/20"
                >
                  <BsPlusLg />
                </button>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {pendingPages.map((p, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white dark:bg-zinc-800 dark-island:bg-zinc-800 pitch-black:bg-zinc-800 px-4 py-2 rounded-xl border-2 border-zinc-50 dark:border-zinc-700 dark-island:border-zinc-700 pitch-black:border-zinc-700 group animate-in slide-in-from-left-2 duration-200">
                    <span className="text-zinc-700 dark:text-zinc-300 dark-island:text-zinc-300 pitch-black:text-zinc-300 flex items-center gap-3">
                      <span className="text-xs font-mono text-zinc-400">{idx + 1}.</span>
                      {p}
                    </span>
                    <button
                      type="button"
                      onClick={() => removePendingPage(idx)}
                      className="text-zinc-400 hover:text-red-500 transition-colors p-1"
                    >
                      <BsTrash size={14} />
                    </button>
                  </div>
                ))}
                {pendingPages.length === 0 && (
                  <p className="text-sm text-zinc-400 italic text-center py-4 border-2 border-dashed border-zinc-100 dark:border-zinc-800 dark-island:border-zinc-800 pitch-black:border-zinc-800 rounded-xl">No pages added yet.</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 dark-island:text-zinc-300 pitch-black:text-zinc-300 mb-3 uppercase tracking-wider">Theme Color</label>
              <div className="flex flex-wrap gap-4">
                {COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setColor(c.value)}
                    className={`w-12 h-12 rounded-2xl transition-all transform hover:scale-110 ${color === c.value ? 'ring-4 ring-(--accent-color)/30 scale-110 border-4 border-white dark:border-zinc-900 dark-island:border-zinc-900 pitch-black:border-zinc-900 shadow-lg' : 'border-2 border-transparent'}`}
                    style={{ backgroundColor: c.value }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto px-12 py-4 bg-(--accent-color) hover:opacity-90 disabled:bg-zinc-400 text-white font-bold text-lg rounded-2xl shadow-xl shadow-(--accent-color)/20 transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                {isSubmitting ? 'Creating...' : 'Create Notebook'}
              </button>
            </div>
          </form>
        </div>

        <div className="hidden lg:flex flex-col items-center justify-center w-80 bg-zinc-100 dark:bg-zinc-800/50 dark-island:bg-zinc-800/50 pitch-black:bg-zinc-800/50 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 dark-island:border-zinc-700 pitch-black:border-zinc-700 p-8 text-center">
          <div
            className="w-32 h-40 rounded-tr-3xl rounded-br-lg rounded-l-lg shadow-2xl mb-6 flex items-center justify-center transition-colors duration-500"
            style={{ backgroundColor: color }}
          >
            <BsJournalText size={48} className="text-white/80" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white dark-island:text-white pitch-black:text-white mb-2">Notebook Preview</h3>
          <p className="text-sm text-zinc-500">This is how your notebook will appear in your workspace.</p>
        </div>
      </div>
    </div>
  );
};

export default CreateNotebook;
