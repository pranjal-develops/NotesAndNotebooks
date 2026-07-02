import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store/store';
import { setNotebooks } from '../store/slice/notebookSlice';
import { notebookApi } from '../api'; // Adjust path to your api file
import MobileSidebar from './Sidebar/MobileSidebar';
import NotesSection from './Sidebar/NotesSection';
import NotebookSection from './Sidebar/NotebookSection';

const Sidebar = () => {
  const dispatch = useDispatch();
  const { isSidebarOpen } = useSelector((state: RootState) => state.ui);

  // 1. Fetch Notebooks on Mount
  useEffect(() => {
    const fetchNotebooks = async () => {
      try {
        const response = await notebookApi.getAll();
        dispatch(setNotebooks(response.data));
      } catch (error) {
        console.error("Failed to fetch notebooks", error);
      }
    };
    fetchNotebooks();
  }, [dispatch]);

  if(!isSidebarOpen){
    return;
  }

  return (
    <>
      <div className="hidden md:flex w-72 2xl:w-80 h-screen m-2 px-1 flex-col">
        <aside className="flex-1 overflow-y-auto px-2 py-4 space-y-6">
          <NotesSection />
          <NotebookSection />
        </aside>
      </div>
      <MobileSidebar />
      {/* {isSidebarOpen && <MobileSidebar />} */}
    </>
  );
};

export default Sidebar;