import { Outlet, useNavigation } from "react-router-dom";
import { LinearProgress, Box } from "@mui/material";
import Header from "../components/Header";

function RootLayout() {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  return (
    <>
      <Header />
      {/* Global loading indicator for route transitions */}
      {isLoading && (
        <Box
          sx={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999 }}
        >
          <LinearProgress />
        </Box>
      )}
      <Outlet />
    </>
  );
}

export default RootLayout;
