import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import CodeBlockWidget from '../Widgets/CodeBlockWidget';
import DrawingWidget from '../Widgets/DrawingWidget';

export const CodeBlockNode = Node.create({
  name: 'codeBlockWidget',
  group: 'block',
  atom: true, // This makes it a single unit (like an image)
  
  addAttributes() {
    return {
      code: { default: '// Your code here' },
      language: { default: 'javascript' },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="code-block-widget"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'code-block-widget' })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CodeBlockWidget);
  },
});

export const DrawingNode = Node.create({
  name: 'drawingWidget',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      dataUrl: { default: null },
      width: { default: 700 },
      height: { default: 350 },
    };
  },

  parseHTML() {
    return [{ 
      tag: 'div[data-type="drawing-widget"]',
      getAttrs: dom => {
        if (typeof dom === 'string') return {};
        const element = dom as HTMLElement;
        return {
          width: parseInt(element.getAttribute('data-width') || '700'),
          height: parseInt(element.getAttribute('data-height') || '350'),
          dataUrl: element.getAttribute('data-url'),
        };
      }
    }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 
      'data-type': 'drawing-widget',
      'data-width': HTMLAttributes.width,
      'data-height': HTMLAttributes.height,
      'data-url': HTMLAttributes.dataUrl,
    })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(DrawingWidget);
  },
});