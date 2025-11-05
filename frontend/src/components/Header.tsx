import { AppBar, Toolbar, Box, IconButton, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LanguageIcon from "@mui/icons-material/Language";
import MapIcon from "@mui/icons-material/Map";
import { useNavigate } from "react-router-dom";

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
        p: 0,
      }}
    >
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            variant="h4"
            sx={{
              color: "primary.main",
              mb: 0,
              fontWeight: "500",
              cursor: "pointer",
            }}
            onClick={() => navigate("/")}
          >
            GAIA
          </Typography>

          <Box>
            <IconButton onClick={() => navigate("/")}>
              <SearchIcon />
            </IconButton>
            <IconButton onClick={() => navigate("/search")}>
              <LanguageIcon />
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
