import { useDispatch } from 'react-redux';
import type { Note as note } from '../types';
import {
  addOptimisticNote,
  resolveOptimisticNote,
  deleteNoteOptimistic,
  updateNoteOptimistic
} from '../store/slice/noteSlice';
import { api } from '../api';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';

export function useHandleEvents() {
  const dispatch = useDispatch();
  const isGuest = useSelector((state: RootState) => state.auth.isGuest);

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
    if (!isGuest) {
      try {
        await api.delete(`/notes/${id}`);
      } catch (error) {
        console.log("Delete failed reverting UI", error);
        // If delete fails, you can trigger a full refetch to sync safely
      }
    }
  };

  const handleUpdate = (updatednote: note) => {
    dispatch(updateNoteOptimistic(updatednote));
  };

  return { handleOptimisticAdd, handleDelete, handleUpdate };
}
