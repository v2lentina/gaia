// HomePage.tsx
import React, { useState, useEffect } from "react";
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
import { SearchOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import type { Country } from "../types/api";
import { searchCountriesByName } from "../api/countryService";

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Country[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Debounced search for dropdown suggestions
  useEffect(() => {
    const performSearch = async () => {
      if (!searchTerm.trim()) {
        // Validate search term and dont send request if empty
        setSearchResults([]);
        setShowDropdown(false);
        return;
      }

      setIsLoading(true);
      try {
        // Use service function
        const countries = await searchCountriesByName(searchTerm);

        setSearchResults(countries);
        setShowDropdown(true);
      } catch (error) {
        console.error("Error searching countries:", error);
        setSearchResults([]);
        setShowDropdown(true);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(performSearch, 300); // Debounce
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Handle input change - triggers new search
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Handle Enter key press - navigate to search results page
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
      setShowDropdown(false);
    }
  };

  //TXS
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h1"
          sx={{ color: "primary.main", mb: 0, fontWeight: "500" }}
        >
          GAIA
        </Typography>

        <Typography
          variant="h6"
          component="p"
          sx={{
            color: "text.secondary",
            mb: 2,
            fontWeight: "normal",
            fontSize: "1rem",
          }}
        >
          Explore the world right from your desktop
        </Typography>

        <Box sx={{ position: "relative", maxWidth: 600, width: "100%" }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search for a country..."
            value={searchTerm}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            onFocus={() => searchTerm && setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlined />
                </InputAdornment>
              ),
            }}
            sx={{
              width: "100%",
              "& .MuiOutlinedInput-root": {
                borderRadius: showDropdown ? "28px 28px 0 0" : "28px",
                "&.Mui-focused fieldset": {
                  borderColor: "primary.main",
                },
              },
            }}
          />

          {showDropdown && (
            <Paper
              sx={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                zIndex: 1000,
                maxHeight: 300,
                overflow: "auto",
                borderRadius: "0 0 24px 24px",
                boxShadow: 3,
              }}
            >
              {isLoading ? (
                <Box sx={{ p: 2, textAlign: "center" }}>
                  <Typography variant="body2" color="text.secondary">
                    Searching...
                  </Typography>
                </Box>
              ) : searchResults.length > 0 ? (
                <List>
                  {searchResults.slice(0, 10).map((country: any) => (
                    <ListItem key={country.name.common} disablePadding>
                      <ListItemButton
                        onClick={() => {
                          navigate(`/country/${country.cca3}`);
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
              ) : (
                searchTerm && (
                  <Box sx={{ p: 2, textAlign: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                      No countries found for "{searchTerm}"
                    </Typography>
                  </Box>
                )
              )}
            </Paper>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default HomePage;
