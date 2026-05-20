import axios from "axios";

const API_BASE =  'http://localhost:8080/api';

export const notebookApi = {
    getAll: ()=> axios.get(`${API_BASE}/notebooks`),
    getById: (id:number) =>axios.get(`${API_BASE}/notebooks/${id}`),
    getPage: (notebookId:number, pageId:number) => axios.get(`${API_BASE}/notebooks/${notebookId}/pages/${pageId}`),
    createNotebook: (data: any) => axios.post(`${API_BASE}/notebooks`, data),
    addPage: (notebookId: number, data:any) => axios.post(`${API_BASE}/notebooks/${notebookId}/pages`, data),
}