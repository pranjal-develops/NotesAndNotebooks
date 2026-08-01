import React from "react";
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from "@tiptap/starter-kit";
import { CodeBlockNode, DrawingNode } from "./Extensions";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import { Extension } from '@tiptap/core';
import Image from '@tiptap/extension-image';
import { TbSketching } from "react-icons/tb";
import { CgCodeSlash, CgImage } from "react-icons/cg";

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

interface EditorData {
  html: string;
  drawings: string[];
  codeBlocks: {
    language: string,
    code: string
  }[];
  images: string[];
}

interface EditorProps {
  content?: string;
  // onChange?: (html: string) => void;
  onChange?: (data: EditorData) => void;
}

const fontFamilies = [
  { label: 'Default', value: 'Inter, sans-serif' },
  { label: 'Serif', value: 'serif' },
  { label: 'Monospace', value: 'monospace' },
  { label: 'Cursive', value: 'cursive' },
];

const fontSizes = ['12px', '14px', '16px', '18px', '20px', '24px', '30px', '36px', '48px'];

const TiptapEditor: React.FC<EditorProps> = ({ content = '', onChange }) => {
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
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-xl border border-slate-200 shadow-sm max-w-full h-auto my-4',
        },
      }),
      Placeholder.configure({
        placeholder: 'Start writing your note...',
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const json = editor.getJSON();
      const drawings: string[] = [];
      const codeBlocks: { language: string; code: string }[] = [];
      const images: string[] = [];

      // Robust recursive search for widgets anywhere in the document
      const extractData = (content: any[]) => {
        if (!content) return;
        for (const node of content) {
          if (node.type === 'drawingWidget' && node.attrs?.dataUrl) {
            drawings.push(node.attrs.dataUrl);
          } else if (node.type === 'codeBlockWidget') {
            codeBlocks.push({
              language: node.attrs?.language || 'javascript',
              code: node.attrs?.code || ''
            });
          } else if (node.type === 'image' && node.attrs?.src) {
            images.push(node.attrs.src);
          }
          if (node.content) {
            extractData(node.content);
          }
        }
      };

      extractData(json.content || []);

      onChange?.({
        html,
        drawings,
        codeBlocks,
        images,
      });
    },
    immediatelyRender: false,
    editorProps: {
      handlePaste: (view, event) => {
        const items = Array.from(event.clipboardData?.items || []);
        const imageItem = items.find(item => item.type.startsWith('image'));

        if (imageItem) {
          const file = imageItem.getAsFile();
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              const src = e.target?.result as string;
              view.dispatch(view.state.tr.replaceSelectionWith(
                view.state.schema.nodes.image.create({ src })
              ));
            };
            reader.readAsDataURL(file);
            return true; // handled
          }
        }
        return false;
      },
      handleDrop: (view, event, _slice, moved) => {
        if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
          const file = event.dataTransfer.files[0];
          if (file.type.startsWith('image')) {
            const reader = new FileReader();
            reader.onload = (e) => {
              const src = e.target?.result as string;
              const { schema } = view.state;
              const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
              if (coordinates) {
                const node = schema.nodes.image.create({ src });
                const transaction = view.state.tr.insert(coordinates.pos, node);
                view.dispatch(transaction);
              }
            };
            reader.readAsDataURL(file);
            return true; // handled
          }
        }
        return false;
      },
    },
  });

  const insertCodeBlock = () => {
    editor?.chain().focus().insertContent({ type: 'codeBlockWidget', attrs: { language: 'javascript', code: '// Start coding...' } }).run();
  };
  // const insertChart = () => {
  //   editor?.chain().focus().insertContent({ type: 'chartWidget', attrs: { language: 'javascript', code: '// Start coding...' } }).run();
  // };

  const insertDrawing = () => {
    editor?.chain().focus().insertContent({ type: 'drawingWidget' }).run();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target?.result as string;
        editor?.chain().focus().setImage({ src }).run();
      };
      reader.readAsDataURL(file);
    }
  };

  if (!editor) return null;

  return (
    <div className="min-h-screen">
      {/* Professional Sticky Toolbar */}
      {/* <div
       className="sticky top-0 z-30 bg-white/60 dark:bg-black/20 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-600 rounded-xl p-4 flex flex-wrap gap-4 items-center justify-center"
       > */}
      <div
        className="sticky top-0 z-20 flex flex-wrap items-center gap-3 border-b border-slate-200/80 bg-white/90 px-4 py-4 backdrop-blur dark:border-zinc-800 dark-island:border-zinc-800 pitch-black:border-zinc-800 dark:bg-zinc-950/80 dark-island:bg-zinc-950/80 pitch-black:bg-zinc-950/80"
      >
        {/* <div className="flex bg-zinc-100 dark:bg-zinc-100 p-1 rounded-xl gap-1"> */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded-lg text-zinc-500 ${editor.isActive("bold") ? "bg-white dark:bg-zinc-900 dark-island:bg-zinc-900 pitch-black:bg-zinc-900 shadow-sm" : "text-zinc-500"}`}
          >
            <b>B</b>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded-lg text-zinc-500 ${editor.isActive("italic") ? "bg-white dark:bg-zinc-900 dark-island:bg-zinc-900 pitch-black:bg-zinc-900 shadow-sm" : "text-zinc-500"}`}
          >
            <i>I</i>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 rounded-lg text-zinc-500 ${editor.isActive("underline") ? "bg-white dark:bg-zinc-900 dark-island:bg-zinc-900 pitch-black:bg-zinc-900 shadow-sm" : "text-zinc-500"}`}
          >
            <u>U</u>
          </button>
        </div>

        {/* Lists */}
        {/* <div className="flex bg-zinc-100 dark:bg-zinc-100 p-1 rounded-xl gap-1"> */}
        <div className="flex p-1 rounded-xl gap-1">
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded-lg text-zinc-500 ${editor.isActive("bulletList") ? "bg-white dark:bg-zinc-900 dark-island:bg-zinc-900 pitch-black:bg-zinc-900 shadow-sm" : "text-zinc-500"}`}
            title="Bullet List"
          >
            •
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded-lg text-zinc-500 ${editor.isActive("orderedList") ? "bg-white dark:bg-zinc-900 dark-island:bg-zinc-900 pitch-black:bg-zinc-900 shadow-sm" : "text-zinc-500"}`}
            title="Numbered List"
          >
            1.
          </button>
        </div>

        {/* Font Family Dropdown */}
        <select
          onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
          className="bg-zinc-100 dark:bg-zinc-900 dark-island:bg-zinc-900 pitch-black:bg-zinc-900 p-2 rounded-xl text-sm outline-none border-none text-zinc-700"
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
          className="bg-zinc-100 dark:bg-zinc-900 dark-island:bg-zinc-900 pitch-black:bg-zinc-900 p-2 rounded-xl text-sm outline-none border-none text-zinc-700"
          value={editor.getAttributes('textStyle').fontSize || ''}
        >
          <option value="">Size</option>
          {fontSizes.map(size => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>

        {/* Color Picker */}
        <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-900 dark-island:bg-zinc-900 pitch-black:bg-zinc-900 p-1 rounded-xl">
          <input
            type="color"
            onInput={(e) => editor.chain().focus().setColor((e.target as HTMLInputElement).value).run()}
            className="w-8 h-8 rounded-xl cursor-pointer border-none bg-transparent"
            value={editor.getAttributes('textStyle').color || '#000000'}
          />
        </div>

        <div className="w-px h-6 bg-zinc-200" />

        <button
          onClick={insertCodeBlock}
          className="flex items-center gap-2 px-2 py-2 bg-zinc-900 text-white rounded-xl text-lg font-bold hover:scale-105 transition-transform"
        >
          <CgCodeSlash />
        </button>
        <button
          onClick={insertDrawing}
          className="flex items-center gap-2 px-2 py-2  bg-zinc-900 text-white rounded-xl text-lg font-bold hover:scale-105 transition-transform"
        >
          <TbSketching />
        </button>
        {/* <button
          onClick={insertChart}
          className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-xl text-sm font-bold hover:scale-105 transition-transform"
        >
          <span>🎨</span> Chart
        </button> */}

        <label className="flex items-center gap-2 px-2 py-2  bg-zinc-900 text-white rounded-xl text-lg font-bold hover:scale-105 transition-transform cursor-pointer">
          <CgImage />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </label>
      </div>

      {/* <div className="max-w-4xl mx-auto py-12 px-6"> */}
      <div className="mx-auto max-w-4xl py-12 px-6">
        <EditorContent
          editor={editor}
          className="rich-text-block prose prose-xl max-w-none focus:outline-none pitch-black:text-white"
        />
      </div>
    </div>
  );
};

export default TiptapEditor;
