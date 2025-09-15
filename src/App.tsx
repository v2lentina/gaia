//App.tsx
// Root component of the React application.
// Defines the main structure and behavior of the app, including routes and UI components.

import "./App.css";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/Homepage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
}

export default App;
