import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Typography,
  styled,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MapIcon from "@mui/icons-material/Map";
import { useNavigate } from "react-router-dom";

// Export header height for layout calculations
export const HEADER_HEIGHT = 64;

// Styled Components
const HeaderContainer = styled(Box)({
  borderBottom: "1px solid #e0e0e0",
  width: "100vw",
  position: "relative",
  left: "50%",
  right: "50%",
  marginLeft: "-50vw",
  marginRight: "-50vw",
  padding: 0,
});

const StyledToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
  minHeight: HEADER_HEIGHT,
});

const Logo = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  marginBottom: 0,
  fontWeight: 500,
  cursor: "pointer",
}));

const Header = () => {
  const navigate = useNavigate();

  return (
    <HeaderContainer>
      <AppBar position="static" color="transparent" elevation={0}>
        <StyledToolbar>
          <Logo variant="h4" onClick={() => navigate("/")}>
            GAIA
          </Logo>

          <Box>
            <IconButton onClick={() => navigate("/")}>
              <SearchIcon />
            </IconButton>
            <IconButton onClick={() => navigate("/map")}>
              <MapIcon />
            </IconButton>
          </Box>
        </StyledToolbar>
      </AppBar>
    </HeaderContainer>
  );
};

export default Header;
