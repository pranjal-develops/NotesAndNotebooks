import axios from "axios";
import { store } from "./store/store";
import { logout } from "./store/slice/authSlice";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080/api";

// 1. Create a custom Axios instance
export const api = axios.create({
    baseURL: API_BASE,
    withCredentials: true, // Necessary if sending cookies or using CORS with credentials
});

// 2. Request Interceptor: Attach the JWT token to every outgoing request
api.interceptors.request.use(
    (config) => {
        const token = store.getState().auth.token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 3. Response Interceptor: Handle 401 Unauthorized errors (expired token)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token has expired or is invalid -> log user out
            store.dispatch(logout());
        }
        return Promise.reject(error);
    }
);

// 4. Update APIs to use the new custom instance
export const notebookApi = {
    getAll: () => api.get("/notebooks"),
    getById: (id: number) => api.get(`/notebooks/${id}`),
    updateNotebook: (id: number, data: any) => api.put(`/notebooks/${id}`, data),
    reorderPages: (id: number, data: { pageIds: number[] }) => api.post(`/notebooks/${id}/pages/reorder`, data),
    getPage: (notebookId: number, pageId: number) => api.get(`/notebooks/${notebookId}/pages/${pageId}`),
    createNotebook: (data: any) => api.post("/notebooks", data),
    addPage: (notebookId: number, data: any) => api.post(`/notebooks/${notebookId}/pages`, data),
    updatePage: (notebookId: number, pageId: number, data: any) => api.put(`/notebooks/${notebookId}/pages/${pageId}`, data),
};

// 5. Add Authentication APIs
export const authApi = {
    login: (data: any) => api.post("/user/login", data),
    register: (data: any) => api.post("/user/register", data),
};
