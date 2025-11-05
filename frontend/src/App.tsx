//App.tsx
// Root component of the React application. - everything the user sees is rendered through this component.
// Defines the main structure and behavior of the app, including routes and UI components.

import { Routes, Route } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import Homepage from "./pages/Homepage";
import Search from "./pages/Search";
import CountryDetails from "./pages/CountryDetails";
import Header from "./components/Header";

function App() {
  return (
    <>
      <Header />
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/search" element={<Search />} />
        <Route path="/country/:code" element={<CountryDetails />} />
      </Routes>
    </>
  );
}

export default App;
