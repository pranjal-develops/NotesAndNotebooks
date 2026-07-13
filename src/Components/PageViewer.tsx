import React from "react";
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from "@tiptap/starter-kit";
import { CodeBlockNode, DrawingNode } from "./Editor/Extensions";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Image from '@tiptap/extension-image';
import { Extension } from '@tiptap/core';

// Custom Font Size Extension (matching NewTiptapEditor)
const FontSize = Extension.create({
  name: 'fontSize',
  addOptions() {
    return { types: ['textStyle'] };
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
});

interface PageViewerProps {
  content: string;
}

const PageViewer: React.FC<PageViewerProps> = ({ content }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: false,
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
    ],
    content: content,
    editable: false,
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <div className="mx-auto max-w-4xl py-12 px-6">
      <EditorContent
        editor={editor}
        className="rich-text-block prose prose-xl max-w-none focus:outline-none dark:prose-invert"
      />
    </div>
  );
};

export default PageViewer;