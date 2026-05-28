import React, { useRef, useState, useEffect } from 'react';
import { 
  BsTypeBold, BsTypeItalic, BsTypeUnderline, 
  BsListUl, BsListOl, BsTypeH1, BsTypeH2,
  BsTextLeft, BsTextCenter, BsTextRight
} from 'react-icons/bs';

interface TextSectionProps {
  initialValue: string;
  onChange: (html: string) => void;
  onFocus?: () => void;
}

const FONTS = [
  { name: 'Sans Serif', value: 'ui-sans-serif, system-ui, sans-serif' },
  { name: 'Serif', value: 'ui-serif, Georgia, serif' },
  { name: 'Monospace', value: 'ui-monospace, SFMono-Regular, monospace' },
  { name: 'Cursive', value: 'cursive' },
  { name: 'Fantasy', value: 'fantasy' },
];

const FONT_SIZES = [
  { label: 'Small', value: '2' },
  { label: 'Normal', value: '3' },
  { label: 'Large', value: '5' },
  { label: 'Huge', value: '7' },
];

const TextSection: React.FC<TextSectionProps> = ({ initialValue, onChange, onFocus }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const lastContent = useRef(initialValue);
  const savedSelection = useRef<Range | null>(null);

  // Helper to save current cursor/selection
  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedSelection.current = sel.getRangeAt(0).cloneRange();
    }
  };

  // Helper to restore cursor/selection
  const restoreSelection = () => {
    if (savedSelection.current) {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(savedSelection.current);
      }
    }
  };

  // 1. Only update the editor if the initialValue is totally different (like switching pages)
  useEffect(() => {
    if (editorRef.current && initialValue !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = initialValue;
      lastContent.current = initialValue;
    }
  }, [initialValue]);

  const applyFormat = (command: string, value?: string) => {
    restoreSelection(); // 1. Restore focus/selection before command
    if (editorRef.current) {
      editorRef.current.focus();
    }
    
    document.execCommand(command, false, value);
    
    saveSelection(); // 2. Re-save after formatting
  };

  const handleInput = () => {
    if (editorRef.current) {
      lastContent.current = editorRef.current.innerHTML;
      saveSelection();
    }
  };

  const handleBlur = (e: React.FocusEvent) => {
    // Check if the new focus target is inside the container
    const nextFocus = e.relatedTarget as Node;
    if (e.currentTarget.contains(nextFocus)) {
      return; // Still focused inside the component
    }

    setIsFocused(false);
    // Sync with Redux only when we truly leave the component
    if (editorRef.current && editorRef.current.innerHTML !== initialValue) {
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className="relative w-full group"
        onBlur={handleBlur}>
      {/* 1. Toolbar with onMouseDown prevention */}
      {isFocused && (
        <div 
          onMouseDown={(e) => e.preventDefault()} // CRITICAL: Prevents editor from losing focus
          className="absolute -top-12 left-0 z-20 flex items-center gap-1 p-1 bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 rounded-xl"
        >
          <button onClick={() => applyFormat('bold')} className="p-2 hover:bg-gray-100 rounded-lg"><BsTypeBold /></button>
          <button onClick={() => applyFormat('italic')} className="p-2 hover:bg-gray-100 rounded-lg"><BsTypeItalic /></button>
          <button onClick={() => applyFormat('underline')} className="p-2 hover:bg-gray-100 rounded-lg" title="Underline"><BsTypeUnderline /></button>
          
          <div className="w-px h-4 bg-gray-200 mx-1" />

          {/* Font Family Dropdown */}
          <select 
            onMouseDown={(e) => e.stopPropagation()} // Prevent parent blur triggers
            onChange={(e) => {
              applyFormat('fontName', e.target.value);
              e.target.value = ""; // Reset for next use
            }}
            className="bg-transparent text-xs font-bold outline-none px-2 py-1 text-gray-600 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            title="Font Family"
            value=""
          >
            <option value="" disabled>Font</option>
            {FONTS.map(font => (
              <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>{font.name}</option>
            ))}
          </select>

          {/* Font Size Dropdown */}
          <select 
            onMouseDown={(e) => e.stopPropagation()} // Prevent parent blur triggers
            onChange={(e) => {
              applyFormat('fontSize', e.target.value);
              // We don't reset font size so user sees current size (approximation)
            }}
            className="bg-transparent text-xs font-bold outline-none px-2 py-1 text-gray-600 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            title="Font Size"
            defaultValue="3"
          >
            {FONT_SIZES.map(size => (
              <option key={size.value} value={size.value}>{size.label}</option>
            ))}
          </select>

          <div className="w-px h-4 bg-gray-200 mx-1" />
          
          <button onClick={() => applyFormat('formatBlock', 'H1')} className="p-2 hover:bg-gray-100 rounded-lg" title="Heading 1"><BsTypeH1 /></button>
          <button onClick={() => applyFormat('formatBlock', 'H2')} className="p-2 hover:bg-gray-100 rounded-lg" title="Heading 2"><BsTypeH2 /></button>
          <div className="w-px h-4 bg-gray-200 mx-1" />
          <button onClick={() => applyFormat('justifyLeft')} className="p-2 hover:bg-gray-100 rounded-lg" title="Align Left"><BsTextLeft /></button>
          <button onClick={() => applyFormat('justifyCenter')} className="p-2 hover:bg-gray-100 rounded-lg" title="Align Center"><BsTextCenter /></button>
          <button onClick={() => applyFormat('justifyRight')} className="p-2 hover:bg-gray-100 rounded-lg" title="Align Right"><BsTextRight /></button>
          <div className="w-px h-4 bg-gray-200 mx-1" />
          <button onClick={() => applyFormat('insertUnorderedList')} className="p-2 hover:bg-gray-100 rounded-lg" title="Bullet List"><BsListUl /></button>
          <button onClick={() => applyFormat('insertOrderedList')} className="p-2 hover:bg-gray-100 rounded-lg" title="Numbered List"><BsListOl /></button>
        </div>
      )}

      {/* 2. The Editor */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onMouseUp={saveSelection}
        onKeyUp={saveSelection}
        onFocus={() => {
          setIsFocused(true);
          saveSelection();
          onFocus?.();
        }}
        // onBlur={() => {
        //   setIsFocused(false);
        //   // 3. FINAL SYNC: We only save to Redux/State when the user leaves the block
        //   if (editorRef.current && editorRef.current.innerHTML !== initialValue) {
        //     onChange(editorRef.current.innerHTML);
        //   }
        // }}
        className="w-full min-h-[1.5em] outline-none text-lg text-gray-700 dark:text-gray-300 leading-relaxed rich-text-block"
      />
    </div>
  );
};

export default TextSection;