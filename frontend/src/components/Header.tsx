import { AppBar, Toolbar, Box, IconButton, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MapIcon from "@mui/icons-material/Map";
import { useNavigate } from "react-router-dom";

// Export header height for layout calculations
export const HEADER_HEIGHT = 64;

const Header = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        borderBottom: "1px solid #e0e0e0",
        width: "100vw",
        position: "relative",
        left: "50%",
        right: "50%",
        marginLeft: "-50vw",
        marginRight: "-50vw",
        padding: 0,
      }}
    >
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            minHeight: HEADER_HEIGHT,
          }}
        >
          <Typography
            variant="h4"
            onClick={() => navigate("/")}
            sx={{
              color: "primary.main",
              marginBottom: 0,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            GAIA
          </Typography>

          <Box>
            <IconButton onClick={() => navigate("/")}>
              <SearchIcon />
            </IconButton>
            <IconButton onClick={() => navigate("/map")}>
              <MapIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
