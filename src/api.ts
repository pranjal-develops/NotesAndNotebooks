import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;

export const notebookApi = {
    getAll: () => axios.get(`${API_BASE}/notebooks`),
    getById: (id: number) => axios.get(`${API_BASE}/notebooks/${id}`),
    updateNotebook: (id: number, data: any) => axios.put(`${API_BASE}/notebooks/${id}`, data),
    reorderPages: (id: number, data: { pageIds: number[] }) => axios.post(`${API_BASE}/notebooks/${id}/pages/reorder`, data),
    getPage: (notebookId: number, pageId: number) => axios.get(`${API_BASE}/notebooks/${notebookId}/pages/${pageId}`),
    createNotebook: (data: any) => axios.post(`${API_BASE}/notebooks`, data),
    addPage: (notebookId: number, data: any) => axios.post(`${API_BASE}/notebooks/${notebookId}/pages`, data),
    updatePage: (notebookId: number, pageId: number, data: any) => axios.put(`${API_BASE}/notebooks/${notebookId}/pages/${pageId}`, data),
}