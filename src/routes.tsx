import { createBrowserRouter, Navigate } from "react-router-dom";
import Home from "./Pages/Home";
import Notes from "./Components/Notes";
import CreateNotebook from "./Components/CreateNotebook";
import NewTiptapPageContainer from "./Pages/NewTiptapPageContainer";

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
        path: "notebooks/:notebookId/pages/:pageId",
        element: <NewTiptapPageContainer />,
        // element: <PageContainer />,
      },
      {
        path: "notebooks/:notebookId/pages/create",
        element: <NewTiptapPageContainer />,
        // element: <PageContainer />,
      },
    ],
  },
]);