// import React, { useState } from "react";
// import {
//   BsArrowLeft,
//   BsCodeSlash,
//   BsDownload,
//   BsPencilFill,
//   BsTrash,
//   BsType,
// } from "react-icons/bs";
// import type { RootState } from "../store/store";
// import { useDispatch, useSelector } from "react-redux";
// import TextSection from "./TextSection";
// import type { Block, BlockType } from "../types";
// import DrawingCanvas from "./Canvas";
// import { Link } from "react-router-dom";

// const UpdatedPageView = () => {
//   const dispatch = useDispatch();
//   const { activePage, activeNotebook } = useSelector(
//     (state: RootState) => state.notebook,
//   );
//   const [blocks, setBlocks] = useState<Block[]>([]);
//   const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

//   // 3. Update block content
//   const updateBlock = (id: string, newContent: string) => {
//     setBlocks(
//       blocks.map((b) => (b.id === id ? { ...b, content: newContent } : b)),
//     );
//   };

//   const deleteBlock = (id: string) => {
//     if (blocks.length > 1) {
//       setBlocks(blocks.filter((b) => b.id !== id));
//     }
//   };

//   const addBlock = (type: BlockType) => {
//     const newBlock: Block = {
//       id: Date.now().toString(),
//       type,
//       content: "",
//       language: type === "code" ? "javascript" : undefined,
//     };
//     setBlocks([...blocks, newBlock]);
//   };

//   if (!activeNotebook || !activePage) {
//     return (
//       <div className="flex flex-col items-center justify-center h-full text-gray-500">
//         <p>No notebook or page selected.</p>
//         <Link
//           to = '/notes'
//           className="mt-4 text-purple-600 hover:underline"
//         >
//           Go back to Notes
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="relative w-full h-full flex flex-col justify-center items-center overflow-y-auto custom-scrollbar">
//       <header className="w-full h-16 flex flex-col justify-between items-center">
//         <Link
//           to='/notes'
//           className=" absolute top-0 left-0 text-gray-400 hover:text-purple-600 flex items-center gap-1 text-xs font-bold uppercase tracking-widest"
//         >
//           <BsArrowLeft /> Back
//         </Link>

//         {/* <button className="absolute top-0 right-0 text-xs font-bold hover:text-purple-600 transition-colors flex items-center gap-1">
//         <BsDownload /> Export Markdown
//       </button> */}
//         <div className="absolute top-0 right-0 flex items-center gap-4 text-gray-400">
//           <span className="text-xs font-medium">Last edited 2 mins ago</span>
//           <button className="text-xs font-bold hover:text-purple-600 transition-colors flex items-center gap-1">
//             <BsDownload /> Export Markdown
//           </button>
//         </div>
//         {/* <div className="flex justify-center items-center">UpdatedPageView</div> */}
//         {/* <h1 className="text-5xl font-black text-gray-900 dark:text-white tracking-tight outline-none mb-4"> */}
//         <h1 className="text-5xl font-bold text-gray-900 dark:text-white tracking-tight outline-none mb-4">
//           {activePage.title}
//         </h1>
//       </header>

//       <div className="space-y-2 editor-canvas">
//         {blocks.map((block) => (
//           <div key={block.id} className="group relative -ml-12 flex gap-4">
//             {/* THE GUTTER (Hidden until hover) */}
//             <div className="w-8 flex flex-col items-center pt-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
//               <button
//                 onClick={() => deleteBlock(block.id)}
//                 className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
//               >
//                 <BsTrash size={14} />
//               </button>
//             </div>

//             {/* THE CONTENT */}
//             <div className="flex-1">
//               {block.type === "text" && (
//                 <TextSection
//                   initialValue={block.content}
//                   onChange={(html) => updateBlock(block.id, html)}
//                 />
//               )}
//               {block.type === "code" && (
//                 <div className="my-6 rounded-xl bg-zinc-100 dark:bg-zinc-800/50 border border-gray-100 dark:border-gray-800 p-1">
//                   <div className="flex justify-between px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
//                     <span>{block.language}</span>
//                     <button
//                       onClick={() =>
//                         navigator.clipboard.writeText(block.content)
//                       }
//                       className="hover:text-purple-600"
//                     >
//                       Copy
//                     </button>
//                   </div>
//                   <textarea
//                     className="w-full bg-transparent p-4 font-mono text-sm text-purple-600 dark:text-purple-400 outline-none resize-none"
//                     value={block.content}
//                     onChange={(e) => updateBlock(block.id, e.target.value)}
//                     rows={block.content.split("\n").length || 3}
//                   />
//                 </div>
//               )}
//               {block.type === "drawing" && (
//                 <div className="my-8 hover:ring-2 hover:ring-purple-100 dark:hover:ring-purple-900/30 rounded-2xl transition-all overflow-hidden">
//                   <DrawingCanvas
//                     initialData={block.content}
//                     onSave={(d) => updateBlock(block.id, d)}
//                   />
//                 </div>
//               )}
//               {block.type === "image" && (
//                 <div
//                   className={`my-8 relative inline-block group/img ${selectedBlockId === block.id ? "ring-4 ring-purple-500/20" : ""}`}
//                 >
//                   <img
//                     id={`img-${block.id}`}
//                     src={block.content}
//                     style={{ width: block.width || "100%" }}
//                     className="rounded-xl cursor-pointer"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       setSelectedBlockId(block.id);
//                     }}
//                   />
//                   {/* ... (resize handle) */}
//                 </div>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//       {/* 3. MINIMALIST FLOATING TOOLBAR */}
//       <div className="fixed bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-1 p-1.5 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-2xl border border-white dark:border-gray-700 shadow-2xl rounded-2xl animate-in slide-in-from-bottom-10">
//         <button
//           onClick={() => addBlock("text")}
//           className="flex items-center gap-2 px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-xl text-gray-600 dark:text-gray-300 transition-all"
//         >
//           <BsType /> <span className="text-xs font-bold">Text</span>
//         </button>
//         <button
//           onClick={() => addBlock("code")}
//           className="flex items-center gap-2 px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-xl text-gray-600 dark:text-gray-300 transition-all"
//         >
//           <BsCodeSlash /> <span className="text-xs font-bold">Code</span>
//         </button>
//         <button
//           onClick={() => addBlock("drawing")}
//           className="flex items-center gap-2 px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-xl text-gray-600 dark:text-gray-300 transition-all"
//         >
//           <BsPencilFill /> <span className="text-xs font-bold">Draw</span>
//         </button>
//         <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-700 my-auto mx-1" />
//         <div className="flex items-center px-2 text-[10px] font-black uppercase tracking-tighter text-gray-400">
//           Ctrl+V to paste image
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UpdatedPageView;
