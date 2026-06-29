import { createBrowserRouter, Navigate } from "react-router-dom";
import Home from "./Pages/Home";
import Notes from "./Components/Notes";
import CreateNotebook from "./Components/CreateNotebook";
import PageContainer from "./Components/PageConatiner";
import NewPageEditor from "./Components/NewPageEditor";
import NewTiptapPageContainer from "./Components/NewTiptapPageContainer";

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
        element: <NewPageEditor />,
        // element: <PageContainer />,
      },
    ],
  },
]);