import { useDispatch } from 'react-redux';
import { SetSideBarOpen } from '../../store/slice/uiSlice';
import NotesSection from "./NotesSection";
import NotebookSection from "./NotebookSection";

const MobileSidebar = () => {
  const dispatch = useDispatch();
  return (
    <div className="md:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-sm">
      <aside className="md:hidden fixed left-0 top-0 bottom-0 w-75 bg-white dark:bg-black p-5 shadow-lg">
         <button className="mb-4 p-2 rounded" onClick={() => dispatch(SetSideBarOpen())}>×</button>
        <NotesSection />
        <NotebookSection />
      </aside>
    </div>
  );
};

export default MobileSidebar;
