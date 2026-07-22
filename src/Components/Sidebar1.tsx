import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { SetSideBarOpen } from "../store/slice/uiSlice"
import { setSelectedTag } from "../store/slice/noteSlice"

const sideElements = [
  {
    icon: "📝",
    name: "All Notes",
  },
  {
    icon: "⭐",
    name: "Favorites",
  },
  {
    icon: "🗑️",
    name: "Trash",
  },
];

const Sidebar = () => {
  const dispatch = useDispatch();
  const { isSidebarOpen } = useSelector((state: RootState) => state.ui);
  const { notes, selectedTag } = useSelector((state: RootState) => state.note);
  const allTags = Array.from(new Set(notes.flatMap(note => note.tags || [])));
  return (
    <>
      <aside className={`h-full md:flex flex-col justify-start p-5 transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-20 hidden md:flex"}`}>
        <div className="space-y-2">
          {sideElements.map((sideElement, index) => (
            <div className="flex items-center px-3 py-2 gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl cursor-pointer transition-colors" key={index}>
              <span className="text-xl">{sideElement.icon}</span>
              {isSidebarOpen && <span className="font-medium">{sideElement.name}</span>}
            </div>
          ))}
        </div>

        {/* MOVE TAGS INSIDE THE ASIDE */}
        {isSidebarOpen && allTags.length > 0 && (
          <div className="mt-8 border-t border-gray-100 dark:border-gray-800 pt-6">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-4">Tags</h3>
            <div className="space-y-1">
              <button onClick={() => dispatch(setSelectedTag(null))} className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-xl transition-all group ${selectedTag === null
                    ? 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <span className={`text-purple-500 transition-opacity ${selectedTag === null ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'}`}>#</span>
                  All
                </button>
              {allTags.map(tag => (
                <button key={tag} onClick={() => dispatch(setSelectedTag(tag))} className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-xl transition-all group ${selectedTag === tag
                    ? 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <span className={`text-purple-500 transition-opacity ${selectedTag === tag ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'}`}>#</span>
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </aside>

      {isSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/50">
          <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-black p-5 shadow-lg">
            <button className="mb-4 p-2 rounded" onClick={() => dispatch(SetSideBarOpen())}>×</button>
            {sideElements.map((sideElement) => (
              <div
                className="flex items-center px-2 py-1 gap-2"
                key={sideElement.icon}
              >
                <span>{sideElement.icon}</span>
                <span>{sideElement.name}</span>
              </div>
            ))}
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;
