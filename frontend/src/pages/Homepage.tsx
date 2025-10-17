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
import type { Country } from "../types/api"; // Import api types

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Country[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Debounced search for dropdown suggestions
  useEffect(() => {
    const searchCountries = async () => {
      if (!searchTerm.trim()) {
        // Validate search term and dont sent request if empty
        setSearchResults([]);
        setShowDropdown(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await axios.get<Country[]>(
          `http://localhost:5000/api/search?q=${encodeURIComponent(searchTerm)}`
        );

        console.log("Frontend Country API data received:", response.data);
        setSearchResults(response.data);
        setShowDropdown(true);
      } catch (error) {
        console.error("Error searching countries:", error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(searchCountries, 100); // Debounce
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Handle input change - triggers new search
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Handle Enter key press - navigate to search results page
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setShowDropdown(false);
    }
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
            placeholder="Search for a country..."
            value={searchTerm}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            onFocus={() => searchTerm && setShowDropdown(true)}
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
