import { useEffect, useState } from "react";
import type { RootState } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import { NotesLoadingTrue, NotesLoadingFalse, setNotes } from "../store/slice/noteSlice";
import axios from "axios";

export function useNotesFetch() {
  const dispatch = useDispatch();

  // Select viewingDrawings in addition to other fields
  const { searchText, notes, selectedTag, viewingDrawings } = useSelector(
    (state: RootState) => state.note,
  );
  const [debouncedSearchText, setDebouncedSearchText] = useState(searchText);

  // Effect for Debouncing
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchText]);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(NotesLoadingTrue());
      try {
        // Toggle endpoint depending on whether we are viewing drawings
        const url = viewingDrawings
          ? `${import.meta.env.VITE_API_BASE}/notes/drawings`
          : `${import.meta.env.VITE_API_BASE}/notes`;

        const response = await axios.get(url, {
          params: {
            q: debouncedSearchText,
            tag: selectedTag,
          },
        });

        // If viewing drawings, map the fields (like mapping isPinned to pinned)
        const data = viewingDrawings
          ? response.data.map((d: any) => ({
            id: d.id,
            title: "",
            description: "",
            drawingData: d.drawingData,
            color: d.color,
            pinned: d.isPinned,
            tags: d.tags,
            isDrawing: true,
            drawing: true,
          }))
          : response.data;

        dispatch(setNotes(data));
      } catch (error) {
        console.log(error);
      } finally {
        dispatch(NotesLoadingFalse());
      }
    };
    fetchData();
  }, [debouncedSearchText, selectedTag, viewingDrawings]); // Trigger on viewingDrawings change

  // Hybrid Local Filtering for "Instant" feel
  const filteredNotes = notes.filter((note) => {
    const searchLower = searchText.toLowerCase();
    const titleMatch = (note.title ?? "").toLowerCase().includes(searchLower);
    const descMatch = (note.description ?? "").toLowerCase().includes(searchLower);

    const tagMatch = !selectedTag || (note.tags ?? []).includes(selectedTag);

    return (titleMatch || descMatch) && tagMatch;
  });

  return { filteredNotes };
}
