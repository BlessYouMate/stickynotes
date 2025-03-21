import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';


import NotesPage from './notes/notesPage.jsx';

// Context Provider
import { TagsProvider } from "./notes/resources/TagsContext";
import { NotesProvider } from './notes/resources/NotesContext.jsx';


// Router
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <NotesProvider>

      <TagsProvider>

              <NotesPage />
              
      </TagsProvider>

      </NotesProvider>
      
    ), 
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
