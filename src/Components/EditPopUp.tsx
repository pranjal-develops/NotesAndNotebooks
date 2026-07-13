import React, { useRef, useState } from "react";
import axios from "axios";
import DrawingCanvas, { type CanvasHandle } from "./Canvas";
import type { Note as NoteType } from '../types';
import { BsPinAngleFill } from "react-icons/bs";

interface EditPopupProps {
  note: NoteType;
  onClose: () => void;
  onUpdate: (updatednote: NoteType) => void;
  onDelete: (id: number) => void;
}

const COLORS = [
  { name: 'Default', value: 'transparent' },
  { name: 'Red', value: '#f28b82' },
  { name: 'Orange', value: '#fbbc04' },
  { name: 'Yellow', value: '#fff475' },
  { name: 'Green', value: '#ccff90' },
  { name: 'Teal', value: '#a7ffeb' },
  { name: 'Blue', value: '#cbf0f8' },
  { name: 'Dark Blue', value: '#aecbfa' },
  { name: 'Purple', value: '#d7aefb' },
  { name: 'Pink', value: '#fdcfe8' },
];

const EditPopup: React.FC<EditPopupProps> = ({ note, onClose, onUpdate, onDelete }) => {
  const [title, setTitle] = useState(note.title);
  const [description, setDescription] = useState(note.description);
  const [isClosing, setIsClosing] = useState(false)
  const [showCanvas, setShowCanvas] = useState(note.drawingData ? true : false);
  const [color, setColor] = useState(note.color || 'transparent');
  const [pinned, setPinned] = useState(note.pinned || false);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState(note?.tags || []);

  const addTag = (e: React.KeyboardEvent) => {
    if ((e.key==='Enter' || e.key===',') && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().replace(',', '');
      if(!tags.includes(newTag)){
        setTags([...tags, newTag]);
      }
      setTagInput('');
    }
  }

  const removeTag = (tagToRemote: string) =>{
    setTags(tags.filter(t=>t!==tagToRemote));
  }

  const canvasRef = useRef<CanvasHandle>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const previousNotes = {...note};
    const updatednote = { ...note, title, description, drawingData: showCanvas ? canvasRef.current?.getSaveData() : note.drawingData, color, pinned, tags };
    onUpdate(updatednote);
    onClose(); // Close the popup after updating
    
    try {
      const response = await axios.put(`http://localhost:8080/api/notes/${note.id}`, updatednote);
      console.log(response);

    } catch (error) {
      console.log("Update failed reverting...",error);
      onUpdate(previousNotes);
    }
  };

  const handleDelete = async () => {
    await onDelete(note.id);
    onClose();
  }

  // const deletenote = async () =>{
  //   try{
  //     await axios.delete(`http://localhost:8080/api/notes/${note.id}`);
  //     window.location.reload();
  //     onClose();
  //   }catch (error){
  //     console.log(error)
  //   }
  // }

  const closePopup = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);

  }

  // const animationClass = isClosing ? 'animate-popup-out' : 'animate-popup-in';

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isClosing ? 'animate-out fade-out duration-200' : 'animate-in fade-in duration-200'}`}>
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={closePopup}
      />

      <div 
  className={`w-full max-w-lg 
  /* Mobile: Slides from bottom, rounded only at top */
  fixed bottom-0 left-0 right-0 rounded-t-3xl 
  /* Desktop: Centered */
  md:relative md:bottom-auto md:rounded-2xl 
  
  bg-white dark:bg-zinc-900 shadow-2xl overflow-hidden transform transition-all duration-300 md:duration-150 ease-out
  ${isClosing ? 'translate-y-full md:translate-y-0 md:scale-95 md:opacity-0' : 'translate-y-0 md:scale-100 md:opacity-100'}`}
  style={{ 
    backgroundColor: color !== 'transparent' ? color : undefined 
  }}
>
  {/* Drag Handle for Mobile */}
  <div className="w-12 h-1.5 bg-zinc-300 dark:bg-zinc-700 rounded-full mx-auto mt-3 mb-1 md:hidden" />
        {/* <div className="flex-col border-b border-zinc-100 dark:border-zinc-800"> */}
        <div className="flex-col">

          {/* <div className="px-6 py-4  flex items-center justify-between "> */}
            {/* <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Edit Note</h2> */}
            <div className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between">
    <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-700/80 dark:text-white/80">Edit Note</h2>
            <button
              type="button"
              onClick={closePopup}
              className="text-zinc-400 hover:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="flex items-center justify-evenly px-2">
            <div className="flex items-center gap-4 py-2">
              <div className="flex flex-wrap gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setColor(c.value)}
                    className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${color === c.value ? 'border-purple-500 scale-110' : 'border-transparent'
                      }`}
                    style={{ backgroundColor: c.value === 'transparent' ? 'white' : c.value }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setPinned(!pinned)}
              className={`p-2 rounded-full transition-colors ${pinned ? 'text-purple-600 bg-purple-50' : 'text-zinc-400 hover:bg-zinc-100'
                }`}
            >
              <BsPinAngleFill size={20} />
            </button>
          </div>
        </div>
        {/* <h2 className="text-xl font-semibold mb-4">Edit note</h2> */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="w-full text-2xl font-bold bg-transparent border-none outline-none placeholder-zinc-400 dark:text-zinc-100"
                // className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all text-zinc-900 dark:text-zinc-100 placeholder-zinc-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                rows={4}
                className="w-full px-4 py-2 bg-zinc-50/50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-(--accent-color)/20 focus:border-(--accent-color) outline-none transition-all text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 resize-none"
              />
            </div>

                <div className="space-y-2">
  <label className="text-xs font-semibold text-zinc-500 uppercase">Tags</label>
  <div className="flex flex-wrap gap-2 p-2 border border-zinc-100 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-800/40 dark:text-white/50">
    {tags.map(tag => (
      <span key={tag} className="flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-md text-xs">
        {tag}
        <button type="button" onClick={() => removeTag(tag)} className="hover:text-purple-900">×</button>
      </span>
    ))}
    <input 
      value={tagInput}
      onChange={(e) => setTagInput(e.target.value)}
      onKeyDown={addTag}
      placeholder="Add tag..."
      className="flex-1 bg-transparent outline-none text-xs"
    />
  </div>
</div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowCanvas(!showCanvas)}
                className="flex items-center gap-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors group"
              >
                <span className="text-lg group-hover:scale-110 transition-transform">
                  {showCanvas ? '−' : '+'}
                </span>
                {showCanvas ? 'Remove Drawing' : 'Add Drawing'}
              </button>

              {showCanvas && (
                <div className="mt-3 animate-in slide-in-from-top-2 duration-200">
                  <DrawingCanvas ref={canvasRef} initialData={note.drawingData} />
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all"
            >
              Delete
            </button>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={closePopup}
                className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 shadow-lg shadow-purple-500/30 transition-all"
              >
                Save
              </button>
            </div>
            {/* <button type="button" onClick={closePopup} className="bg-zinc-500 text-white py-2 px-4 rounded-md hover:bg-zinc-600 transition">
      Cancel
    </button> */}
          </div>
        </form>
      </div>



    </div>
  );
};

export default EditPopup;
