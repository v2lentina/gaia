//App.tsx
// Root component of the React application.
// Defines the main structure and behavior of the app, including routes and UI components.

import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Homepage";
import CountryDetail from "./pages/CountryDetail";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/country/:name" element={<CountryDetail />} />
    </Routes>
  );
}

export default App;
