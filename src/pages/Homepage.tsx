// HomePage.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Box,
  Typography,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Paper,
  Avatar,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/countries");
        setCountries(response.data);
      } catch (error) {
        console.error("Error when fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Event comes from an html input element
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    // Filter countries based on search term
    const results = countries.filter((country: any) =>
      country.name.common.toLowerCase().includes(term)
    );
    setFilteredCountries(results);
  };

  //TXS
  return (
    <Container maxWidth="md">
      <Box sx={{}}>
        <Typography
          variant="h1"
          component="h1"
          gutterBottom
          align="center"
          sx={{ color: "primary.main", mb: 0 }}
        >
          GAIA
        </Typography>

        <Typography
          variant="h6"
          component="p"
          align="center"
          sx={{
            color: "text.secondary",
            mb: 2,
            fontWeight: "normal",
          }}
        >
          Explore the world right from your desktop
        </Typography>

        <Box sx={{ position: "relative", maxWidth: 600, mx: "auto" }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search for countries..."
            value={searchTerm}
            onChange={handleSearch}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ width: "100%" }}
          />

          {showDropdown && filteredCountries.length > 0 && (
            <Paper
              sx={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                zIndex: 1000,
                maxHeight: 300,
                overflow: "auto",
              }}
            >
              <List>
                {filteredCountries.slice(0, 10).map((country: any) => (
                  <ListItem key={country.name.common} disablePadding>
                    <ListItemButton
                      onClick={() => {
                        navigate(`/country/${country.name.common}`);
                        setShowDropdown(false);
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          src={country.flags.svg}
                          alt={`${country.name.common} flag`}
                          sx={{ width: 32, height: 24 }}
                        />
                      </ListItemAvatar>
                      <ListItemText primary={country.name.common} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </Box>

        {searchTerm && filteredCountries.length === 0 && (
          <Typography variant="body1" align="center" sx={{ mt: 2 }}>
            No countries found for "{searchTerm}"
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default HomePage;
