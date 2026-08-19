// import { addOptimisticNote, deleteNoteOptimistic, setNotes, updateNoteOptimistic } from "../store/slice/noteSlice";
import type { Note, Notebook } from "../types";


export function getGuestNotes() {
    return JSON.parse(localStorage.getItem("guestNotes") || "[]");
}

export function saveGuestNote(note: Note) {
    // dispatch(addOptimisticNote(note));
    const notes = localStorage.getItem("guestNotes") || "[]";
    const parsedNotes = JSON.parse(notes);
    parsedNotes.push(note);
    console.log(parsedNotes);

    localStorage.setItem("guestNotes", JSON.stringify(parsedNotes));
}

export function deleteGuestNote(id: number) {
    // dispatch(deleteNoteOptimistic(id));
    const notes = localStorage.getItem("guestNotes") || "[]";
    const parsedNotes = JSON.parse(notes);
    const filteredNotes = parsedNotes.filter((n: Note) => n.id !== id);
    localStorage.setItem("guestNotes", JSON.stringify(filteredNotes));
}

export function updateGuestNote(note: Note) {
    // dispatch(updateNoteOptimistic(note));
    const notes = localStorage.getItem("guestNotes") || "[]";
    const parsedNotes = JSON.parse(notes);
    const filteredNotes = parsedNotes.filter((n: Note) => n.id !== note.id);
    filteredNotes.push(note);
    localStorage.setItem("guestNotes", JSON.stringify(filteredNotes));
}

export function clearGuestNotes() {
    // dispatch(setNotes([])); 
    localStorage.removeItem("guestNotes");
}

export function getGuestNotebooks() {
    return JSON.parse(localStorage.getItem("guestNotebooks") || "[]");
}

export function getGuestNotebookById(id: number) {
    const notebooks = getGuestNotebooks();
    return notebooks.find((n: Notebook) => n.id === id);
}

export function saveGuestNotebook(notebook: Notebook) {
    // dispatch(addOptimisticNote(note));
    const notes = localStorage.getItem("guestNotebooks") || "[]";
    const parsedNotes = JSON.parse(notes);
    parsedNotes.push(notebook);
    console.log(parsedNotes);

    localStorage.setItem("guestNotebooks", JSON.stringify(parsedNotes));
}

export function deleteGuestNotebook(id: number) {
    // dispatch(deleteNoteOptimistic(id));
    const notes = localStorage.getItem("guestNotebooks") || "[]";
    const parsedNotes = JSON.parse(notes);
    const filteredNotes = parsedNotes.filter((n: Notebook) => n.id !== id);
    localStorage.setItem("guestNotebooks", JSON.stringify(filteredNotes));
}

export function updateGuestNotebook(notebook: Notebook) {
    // dispatch(updateNoteOptimistic(note));
    const notes = localStorage.getItem("guestNotebooks") || "[]";
    const parsedNotes = JSON.parse(notes);
    const filteredNotes = parsedNotes.filter((n: Notebook) => n.id !== notebook.id);
    filteredNotes.push(notebook);
    localStorage.setItem("guestNotebooks", JSON.stringify(filteredNotes));
}

export function clearGuestNotebooks() {
    // dispatch(setNotes([])); 
    localStorage.removeItem("guestNotebooks");
}