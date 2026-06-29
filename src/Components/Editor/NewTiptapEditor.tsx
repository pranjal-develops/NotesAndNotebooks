import React from "react";
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from "@tiptap/starter-kit";
import { CodeBlockNode, DrawingNode } from "./Extensions";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import {TextStyle} from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import { Extension } from '@tiptap/core';

// Custom Font Size Extension
const FontSize = Extension.create({
  name: 'fontSize',
  addOptions() {
    return {
      types: ['textStyle'],
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: element => element.style.fontSize,
            renderHTML: attributes => {
              if (!attributes.fontSize) return {};
              return { style: `font-size: ${attributes.fontSize}` };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize: (fontSize: string) => ({ chain }: any) => {
        return chain().setMark('textStyle', { fontSize }).run();
      },
      unsetFontSize: () => ({ chain }: any) => {
        return chain().setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run();
      },
    };
  },
});

interface NewTiptapEditorProps {
  content?: string;
  onChange?: (html: string) => void;
}

const fontFamilies = [
  { label: 'Default', value: 'Inter, sans-serif' },
  { label: 'Serif', value: 'serif' },
  { label: 'Monospace', value: 'monospace' },
  { label: 'Cursive', value: 'cursive' },
];

const fontSizes = ['12px', '14px', '16px', '18px', '20px', '24px', '30px', '36px', '48px'];

const NewTiptapEditor: React.FC<NewTiptapEditorProps> = ({ content = '', onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: false, // We'll use the explicit extensions for more control
        orderedList: false,
      }),
      BulletList,
      OrderedList,
      ListItem,
      Underline,
      TextStyle,
      Color,
      FontFamily,
      FontSize,
      CodeBlockNode,
      DrawingNode,
      Placeholder.configure({
        placeholder: 'Start writing your note...',
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    immediatelyRender: false,
  });

  const insertCodeBlock = () => {
    editor?.chain().focus().insertContent({ type: 'codeBlockWidget', attrs: { language: 'javascript', code: '// Start coding...' } }).run();
  };

  const insertDrawing = () => {
    editor?.chain().focus().insertContent({ type: 'drawingWidget' }).run();
  };

  if (!editor) return null;
    
  return (
    <div className="min-h-screen">
      {/* Professional Sticky Toolbar */}
      <div
       className="sticky top-0 z-30 bg-white/60 dark:bg-black/20 backdrop-blur-md border-b border-gray-100 dark:border-zinc-600 rounded-xl p-4 flex flex-wrap gap-4 items-center justify-center"
       >
        <div className="flex bg-gray-100 dark:bg-zinc-100 p-1 rounded-xl gap-1">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded-lg ${editor.isActive("bold") ? "bg-white shadow-sm text-blue-600" : "text-gray-500"}`}
          >
            <b>B</b>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded-lg ${editor.isActive("italic") ? "bg-white shadow-sm text-blue-600" : "text-gray-500"}`}
          >
            <i>I</i>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 rounded-lg ${editor.isActive("underline") ? "bg-white shadow-sm text-blue-600" : "text-gray-500"}`}
          >
            <u>U</u>
          </button>
        </div>

        {/* Lists */}
        <div className="flex bg-gray-100 dark:bg-zinc-100 p-1 rounded-xl gap-1">
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded-lg ${editor.isActive("bulletList") ? "bg-white shadow-sm text-blue-600" : "text-gray-500"}`}
            title="Bullet List"
          >
            •
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded-lg ${editor.isActive("orderedList") ? "bg-white shadow-sm text-blue-600" : "text-gray-500"}`}
            title="Numbered List"
          >
            1.
          </button>
        </div>

        {/* Font Family Dropdown */}
        <select
          onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
          className="bg-gray-100 dark:bg-zinc-100 p-2 rounded-xl text-sm outline-none border-none text-gray-700"
          value={editor.getAttributes('textStyle').fontFamily || ''}
        >
          <option value="">Font</option>
          {fontFamilies.map(f => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>

        {/* Font Size Dropdown */}
        <select
          onChange={(e) => (editor.chain().focus() as any).setFontSize(e.target.value).run()}
          className="bg-gray-100 dark:bg-zinc-100 p-2 rounded-xl text-sm outline-none border-none text-gray-700"
          value={editor.getAttributes('textStyle').fontSize || ''}
        >
          <option value="">Size</option>
          {fontSizes.map(size => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>

        {/* Color Picker */}
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-zinc-100 p-1 rounded-xl">
          <input
            type="color"
            onInput={(e) => editor.chain().focus().setColor((e.target as HTMLInputElement).value).run()}
            className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent"
            value={editor.getAttributes('textStyle').color || '#000000'}
          />
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

      {/* <div className="max-w-4xl mx-auto py-12 px-6"> */}
      <div className="max-w-4xl py-12 px-6">
        <EditorContent
          editor={editor}
          className="rich-text-block prose prose-xl max-w-none focus:outline-none"
        />
      </div>
    </div>
  );
};

export default NewTiptapEditor;
