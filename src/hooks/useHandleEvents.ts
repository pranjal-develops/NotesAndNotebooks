import { useDispatch } from 'react-redux';
import type { Note as note } from '../types';
import {
  addOptimisticNote,
  resolveOptimisticNote,
  deleteNoteOptimistic,
  updateNoteOptimistic
} from '../store/slice/noteSlice';
import axios from 'axios';

export function useHandleEvents() {
  const dispatch = useDispatch();

  const handleOptimisticAdd = (noteData: note, meta?: { tempId?: number; shouldRemove?: boolean }) => {
    if (meta?.shouldRemove) {
      dispatch(deleteNoteOptimistic(noteData.id));
    } else if (meta?.tempId) {
      dispatch(resolveOptimisticNote({ tempId: meta.tempId, note: noteData }));
    } else {
      dispatch(addOptimisticNote(noteData));
    }
  };

  const handleDelete = async (id: number) => {
    dispatch(deleteNoteOptimistic(id));
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE}/notes/${id}`);
    } catch (error) {
      console.log("Delete failed reverting UI", error);
      // If delete fails, you can trigger a full refetch to sync safely
    }
  };

  const handleUpdate = (updatednote: note) => {
    dispatch(updateNoteOptimistic(updatednote));
  };

  return { handleOptimisticAdd, handleDelete, handleUpdate };
}
