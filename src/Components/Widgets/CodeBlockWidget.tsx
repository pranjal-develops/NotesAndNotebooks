import { NodeViewWrapper } from '@tiptap/react';
import Editor from "@monaco-editor/react";
import { MdOutlineContentCopy } from "react-icons/md";

const languages = [
  { label: 'JavaScript', value: 'javascript' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'Python', value: 'python' },
  { label: 'HTML', value: 'html' },
  { label: 'CSS', value: 'css' },
  { label: 'Java', value: 'java' },
  { label: 'C++', value: 'cpp' },
];



const CodeBlockWidget = ({ node, updateAttributes, editor }: any) => {

  const code = node.attrs.code || "";
  const isEditable = editor.isEditable;
  const minHeight = isEditable ? 200 : 0;
  const lineCount = code.length ? code.split("\n").length : 1;
  const lineHeight = 18;
  const padding = isEditable ? 40 : 20;
  const editorHeight = Math.max(minHeight, lineCount*lineHeight + padding);

  return (
    <NodeViewWrapper className="code-block-widget my-4 shadow-lg rounded-xl overflow-hidden border border-zinc-200">
      <div className="bg-zinc-800 px-4 py-2 flex justify-between items-center text-white text-xs font-bold">
        {isEditable ? (
          <select
            value={node.attrs.language}
            onChange={(e) => updateAttributes({ language: e.target.value })}
            className="bg-zinc-700 text-white rounded px-2 py-1 outline-none border-none cursor-pointer hover:bg-zinc-600 transition-colors"
          >
            {languages.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        ) : (
          <button 
          className='cursor-pointer text-white'
          onClick={() => navigator.clipboard.writeText(code)}>
            <MdOutlineContentCopy />
          </button>
        )}
        <span>{node.attrs.language.toUpperCase()}</span>
      </div>
      <Editor
        height={editorHeight}
        theme="vs-dark"
        language={node.attrs.language}
        value={node.attrs.code}
        onChange={(val) => isEditable && updateAttributes({ code: val })}
        options={{ 
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: "on",
          readOnly: !isEditable,
          domReadOnly: !isEditable,
          scrollBeyondLastLine: false,
          contextmenu: isEditable,
        }}
      />
    </NodeViewWrapper>
  );
};

export default CodeBlockWidget;