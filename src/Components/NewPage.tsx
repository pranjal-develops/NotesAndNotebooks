import { BsType, BsCodeSlash, BsPencilFill } from 'react-icons/bs'
// import DrawingCanvas from './NewCanvas'

const NewPage = () => {
  return (
    <div>
        <div
                // onClick={() => setSelectedBlockId(null)}
                className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-2xl rounded-2xl p-2 flex gap-2 border border-white/20 dark:border-gray-700 animate-in slide-in-from-bottom-8 duration-500"
              >
                <button 
                // onClick={() => addBlock('text')}
                 className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl text-gray-600 dark:text-gray-300 transition-all">
                  <BsType /> <span className="text-xs font-bold">Text</span>
                </button>
                <button
                //  onClick={() => addBlock('code')} 
                 className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl text-gray-600 dark:text-gray-300 transition-all">
                  <BsCodeSlash /> <span className="text-xs font-bold">Code</span>
                </button>
                <button 
                // onClick={() => addBlock('drawing')} 
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl text-gray-600 dark:text-gray-300 transition-all">
                  <BsPencilFill /> <span className="text-xs font-bold">Draw</span>
                </button>
                <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 my-auto mx-1" />
                <div className="flex items-center px-2 text-[10px] font-black uppercase tracking-tighter text-gray-400">
                  Ctrl+V to paste image
                </div>
              </div>
    </div>
  )
}

export default NewPage