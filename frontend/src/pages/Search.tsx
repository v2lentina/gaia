// Search.tsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Button,
  Typography,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  CircularProgress,
  Tooltip,
  Pagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import SortIcon from "@mui/icons-material/Sort";
import { useSearchParams, useNavigate } from "react-router-dom";
import type { Country } from "../types/api";
import { searchCountriesByName } from "../api/countryService";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // State
  const [searchTerm, setSearchTerm] = useState(searchParams.get("query") || "");
  const [searchResults, setSearchResults] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "default">(
    "default"
  );

  // Sort countries based on sortOrder
  const sortCountries = (countries: Country[]) => {
    if (sortOrder === "default") return countries;

    // Create a copy of the countries array
    return [...countries].sort((a, b) => {
      const nameA = a.name.common.toLowerCase();
      const nameB = b.name.common.toLowerCase();

      if (sortOrder === "asc") {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });
  };

  //Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const sortedResults = sortCountries(searchResults);
  const currentItems = sortedResults.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(searchResults.length / itemsPerPage);

  // Search only on initial load if URL has query parameter
  useEffect(() => {
    if (searchTerm) {
      performSearch();
    }
  }, []);

  // API call to search countries
  const performSearch = async () => {
    if (!searchTerm.trim()) {
      // Validate search term and dont send request if empty
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    setCurrentPage(1);

    try {
      // Use service function instead of direct axios call
      const countries = await searchCountriesByName(searchTerm);

      setSearchResults(countries);
    } catch (error) {
      console.error("Error searching countries:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search input changes
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Handle search submit
  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      setSearchParams({ query: searchTerm.trim() });
      performSearch();
    }
  };

  // Handle country card click
  const handleCountryClick = (countryCca3: string) => {
    navigate(`/country/${countryCca3}`);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 3, borderBottom: 1, borderColor: "divider" }}>
        <Box
          component="form"
          onSubmit={handleSearchSubmit}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search for countries..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{
              maxWidth: 600,
              "& .MuiOutlinedInput-root": {
                borderRadius: "28px",
              },
            }}
          />

          <Button
            variant="outlined"
            size="small"
            startIcon={
              sortOrder === "asc" ? (
                <ArrowUpwardIcon />
              ) : sortOrder === "desc" ? (
                <ArrowDownwardIcon />
              ) : (
                <SortIcon />
              )
            }
            onClick={() => {
              if (sortOrder === "default") setSortOrder("asc");
              else if (sortOrder === "asc") setSortOrder("desc");
              else setSortOrder("default");
            }}
            sx={{
              textTransform: "none",
              borderRadius: "20px",
              px: 2,
            }}
          >
            {sortOrder === "asc"
              ? "A-Z"
              : sortOrder === "desc"
              ? "Z-A"
              : "Sort"}
          </Button>
        </Box>
      </Box>

      <Box sx={{ py: 4 }}>
        {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {!isLoading && searchResults.length === 0 && searchTerm && (
          <Typography variant="body1" color="text.secondary" textAlign="left">
            Your search "{searchTerm}" did not match any documents.
            <br /> <br />
            Suggestions:
            <br />
            Make sure that all words are spelled correctly.
            <br /> Try different keywords.
            <br /> Try more general keywords.
          </Typography>
        )}

        {!isLoading && searchResults.length > 0 && (
          <Grid container spacing={3}>
            {currentItems.map((country) => (
              <Grid
                size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                key={country.name.common}
              >
                <Card
                  sx={{
                    height: "100%",
                    boxShadow: 0,
                    "&:hover": {
                      transform: "scale(1.1)",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.20)",
                    },
                  }}
                >
                  <CardActionArea
                    onClick={() => handleCountryClick(country.cca3)}
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "stretch",
                    }}
                  >
                    <Box
                      sx={{
                        width: "100%",
                        height: 160,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Box
                        component="img"
                        src={country.flags.svg}
                        alt={`${country.name.common} flag`}
                        loading="lazy"
                        sx={{
                          maxHeight: "100%",
                          maxWidth: "100%",
                          width: "auto",
                          height: "auto",
                          border: "1px solid #ccc",
                          display: "block",
                        }}
                      />
                    </Box>

                    <CardContent>
                      <Tooltip title={country.name.common} arrow>
                        <Typography
                          variant="h6"
                          component="h2"
                          sx={{
                            textAlign: "center",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            width: "100%",
                          }}
                        >
                          {country.name.common}
                        </Typography>
                      </Tooltip>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {!isLoading && searchResults.length > itemsPerPage && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(_, page) => setCurrentPage(page)}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
            />
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Search;
