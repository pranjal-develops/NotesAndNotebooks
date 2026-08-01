import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store/store";
import { setNotebooks } from "../../store/slice/notebookSlice";
import { notebookApi } from "../../api"; // Adjust path to your api file
import MobileSidebar from "./Contents/MobileSidebar";
import VisibleSidebar from "./Contents/VisibleSidebar";
import SidebarContent from "./Contents/SidebarContent";

interface SidebarProps {
  width?: number;
}

const Sidebar: React.FC<SidebarProps> = ({ width = 288 }) => {
  const dispatch = useDispatch();
  const { isSidebarOpen, sidebarType } = useSelector(
    (state: RootState) => state.ui,
  );

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

  return (
    <>
      <VisibleSidebar />
      {sidebarType && <SidebarContent width={width} />}
      {isSidebarOpen && <MobileSidebar />}
    </>
  );
};

export default Sidebar;
