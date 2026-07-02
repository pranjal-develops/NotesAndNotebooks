import { NodeViewWrapper } from '@tiptap/react';
import Editor from "@monaco-editor/react";
import React from 'react';

const languages = [
  { label: 'JavaScript', value: 'javascript' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'Python', value: 'python' },
  { label: 'HTML', value: 'html' },
  { label: 'CSS', value: 'css' },
  { label: 'Java', value: 'java' },
  { label: 'C++', value: 'cpp' },
];



const CodeBlockWidget = ({ node, updateAttributes }: any) => {

  const code = node.attrs.code || "";
  const minHeight = 200;
  const lineCount = code.length ? code.split("\n").length : 1;
  const lineHeight = 18;
  const padding = 40;
  const editorHeight = Math.max(minHeight, lineCount*lineHeight + padding);

  return (
    <NodeViewWrapper className="code-block-widget my-4 shadow-lg rounded-xl overflow-hidden border border-gray-200">
      <div className="bg-zinc-800 px-4 py-2 flex justify-between items-center text-white text-xs font-bold">
        <select
          value={node.attrs.language}
          onChange={(e) => updateAttributes({ language: e.target.value })}
          className="bg-zinc-700 text-white rounded px-2 py-1 outline-none border-none cursor-pointer hover:bg-gray-600 transition-colors"
        >
          {languages.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
        <span>{node.attrs.language.toUpperCase()}</span>
      </div>
      <Editor
        // height="200px"
        height={editorHeight}
        theme="vs-dark"
        language={node.attrs.language}
        value={node.attrs.code}
        onChange={(val) => updateAttributes({ code: val })}
        options={{ 
          minimap: { enabled: false },
          fontSize: 14,
           wordWrap: "on",
         }}
      />
    </NodeViewWrapper>
  );
};

export default CodeBlockWidget;