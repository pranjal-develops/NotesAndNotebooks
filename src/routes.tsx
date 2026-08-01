import { createBrowserRouter, Navigate } from "react-router-dom";
import Home from "./Pages/Home";
import Notes from "./Components/Notes/Notes";
import CreateNotebook from "./Components/CreateNotebook";
import PageContainer from "./Components/Notebooks/PageContainer";
import Notebook from "./Components/Notebooks/Notebook";
import EditNotebook from "./Components/Notebooks/EditNotebook";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [
      {
        index: true,
        element: <Navigate to="/notes" replace />,
      },
      {
        path: "notes",
        element: <Notes />,
      },
      {
        path: "notebooks/create",
        element: <CreateNotebook />,
      },
      {
        path: "notebooks/:notebookId",
        element: <Notebook />,
      },
      {
        path: "notebooks/:notebookId/edit",
        element: <EditNotebook />,
      },
      {
        path: "notebooks/:notebookId/pages/:pageId",
        element: <PageContainer />,
      },
      {
        path: "notebooks/:notebookId/pages/create",
        element: <PageContainer />,
      },
    ],
  },
]);