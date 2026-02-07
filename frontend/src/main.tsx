import { StrictMode, useMemo } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import useMediaQuery from "@mui/material/useMediaQuery";
import RootLayout from "./routes/RootLayout.tsx";
import Homepage from "./routes/Homepage.tsx";
import Search from "./routes/Search.tsx";
import CountryDetails from "./routes/CountryDetailsPage.tsx";
import WorldMap from "./routes/WorldMap.tsx";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <RootLayout />,
      children: [
        { index: true, element: <Homepage /> },
        { path: "search", element: <Search /> },
        { path: "country/:code", element: <CountryDetails /> },
        { path: "map", element: <WorldMap /> },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  }
);

function Root() {
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDark ? "dark" : "light",
          primary: { main: "#2f70e0" },
          secondary: { main: "#69a51f" },
        },
        typography: {
          fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif",
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              "#root": {
                width: "100%",
                minWidth: 320,
                margin: "0",
                padding: "0",
              },
            },
          },
        },
      }),
    [prefersDark]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
