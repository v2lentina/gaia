// main.tsx
// Entry point of the React application.
// Renders the App component into the DOM and wraps it with BrowserRouter for routing and StrictMode for development checks.

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <StrictMode>
      <App />
    </StrictMode>
    ,
  </BrowserRouter>
);
