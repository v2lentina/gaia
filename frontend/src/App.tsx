//App.tsx
// Root component of the React application.
// Defines the main structure and behavior of the app, including routes and UI components.

import "./App.css";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Homepage from "./pages/Homepage";
import Search from "./pages/Search";
import CountryDetails from "./pages/CountryDetails";

// Create a theme instance for Material-UI
const theme = createTheme({
  palette: {
    primary: {
      main: "#2f70e0ff",
    },
    secondary: {
      main: "#69a51fff",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/search" element={<Search />} />
        <Route path="/country/:name" element={<CountryDetails />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
