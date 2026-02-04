import { Routes, Route } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import Homepage from "./pages/Homepage";
import Search from "./pages/Search";
import CountryDetails from "./pages/CountryDetailsPage";
import Header from "./components/Header";
import WorldMap from "./pages/WorldMap";

function App() {
  return (
    <>
      <Header />
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/search" element={<Search />} />
        <Route path="/country/:code" element={<CountryDetails />} />
        <Route path="/map" element={<WorldMap />} />
      </Routes>
    </>
  );
}

export default App;
