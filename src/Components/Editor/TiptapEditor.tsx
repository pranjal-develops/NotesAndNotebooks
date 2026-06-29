import { Editor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import { CodeBlockNode, DrawingNode } from './Extensions';
import React, { useEffect, useState } from 'react';

interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({ content, onChange }) => {
  const [editor, setEditor] = useState<Editor | null>(null);

  useEffect(() => {
    const instance = new Editor({
      extensions: [
        StarterKit,
        Underline,
        CodeBlockNode,
        DrawingNode,
        Placeholder.configure({
          placeholder: 'Start writing your note... Use the buttons above to insert widgets!',
        }),
      ],
      content: content,
      onUpdate: ({ editor }) => {
        onChange(editor.getHTML());
      },
      // Removed immediatelyRender to fix TS error, 
      // as it's handled automatically in modern Tiptap constructors
    });

    setEditor(instance);

    return () => instance.destroy();
  }, []);

  const insertCodeBlock = () => {
    editor?.chain().focus().insertContent({ type: 'codeBlockWidget', attrs: { language: 'javascript', code: '// Start coding...' } }).run();
  };

  const insertDrawing = () => {
    editor?.chain().focus().insertContent({ type: 'drawingWidget' }).run();
  };

  if (!editor) return null;

  return (
    <div className="min-h-screen bg-white">
      {/* Professional Sticky Toolbar */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 p-4 flex gap-4 items-center justify-center">
        <div className="flex bg-gray-100 p-1 rounded-xl gap-1">
          <button onClick={() => editor.chain().focus().toggleBold().run()} className={`p-2 rounded-lg ${editor.isActive('bold') ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}><b>B</b></button>
          <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-2 rounded-lg ${editor.isActive('italic') ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}><i>I</i></button>
        </div>
        
        <div className="w-px h-6 bg-gray-200" />
        
        <button 
          onClick={insertCodeBlock}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold hover:scale-105 transition-transform"
        >
          <span>{`</>`}</span> Code
        </button>
        <button 
          onClick={insertDrawing}
          className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-xl text-sm font-bold hover:scale-105 transition-transform"
        >
          <span>🎨</span> Sketch
        </button>
      </div>

      <div className="max-w-4xl mx-auto py-12 px-6">
        <EditorContent editor={editor} className="prose prose-xl max-w-none focus:outline-none" />
      </div>
    </div>
  );
}
export default TiptapEditor;