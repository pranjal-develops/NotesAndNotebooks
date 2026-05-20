import React from 'react'
import { useDispatch } from 'react-redux';
import { SetSideBarOpen } from '../../store/slice/uiSlice';

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

const MobileSidebar = () => {
    const dispatch = useDispatch();
  return (
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
  )
}

export default MobileSidebar