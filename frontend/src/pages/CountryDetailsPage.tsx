import { useState, useEffect, lazy, Suspense } from "react";
import {
  Container,
  Box,
  CircularProgress,
  Alert,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { getRestCountriesData, getWikiData } from "../api/countryService";
import type { CountryDetails } from "../types/api";
import CountryBasicInfo from "../components/CountryBasicInfo";
import CountryWikiData from "../components/CountryWikiData";
import CountryImages from "../components/CountryImages";

const WeatherApp = lazy(() => import("weatherRemote/WeatherApp"));

const CountryDetailsPage = () => {
  const { code } = useParams<{ code: string }>();
  const [country, setCountry] = useState<CountryDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [wikiDataLoading, setWikiDataLoading] = useState(false);

  useEffect(() => {
    const loadCountryData = async () => {
      if (!code) return;

      setLoading(true);
      setWikiDataLoading(false);

      try {
        const basicData = await getRestCountriesData(code.toUpperCase());

        setCountry({
          ...basicData,
          wikiData: undefined,
        });

        setWikiDataLoading(true);
        try {
          const wikiData = await getWikiData(code.toUpperCase());

          setCountry(
            (prev) => (prev ? { ...prev, wikiData } : null) //country should never be null
          );
        } catch (wikiError) {
          console.warn("WikiData loading failed:", wikiError);
        } finally {
          setWikiDataLoading(false);
        }
      } catch (error) {
        console.error("Error loading basic country data:", error);
      } finally {
        // handle all cleanup in the finally
        setLoading(false);
      }
    };

    loadCountryData();
  }, [code]);

  if (loading) {
    return (
      <Container
        maxWidth="lg"
        sx={{ display: "flex", justifyContent: "center", mt: 8 }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (!country) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">Country not found</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ height: "100vh", display: "flex", overflow: "hidden" }}>
      <Box
        sx={{
          flex: "0 0 50%",
          overflowY: "auto",
          height: "100vh",
          px: 3,
          py: 4,
        }}
      >
        <Box sx={{ maxWidth: 600, mx: "auto" }}>
          <CountryBasicInfo country={country} />

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
              Additional Information
            </Typography>
            <CountryWikiData
              wikiData={country.wikiData}
              loading={wikiDataLoading}
            />
          </Box>

          {/* Weather Widget */}
          {country.capital?.[0] && (
            <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
              <Suspense fallback={<CircularProgress size={24} />}>
                <WeatherApp city={country.capital[0]} />
              </Suspense>
            </Box>
          )}
        </Box>
      </Box>

      <Box
        sx={{
          flex: "0 0 50%",
          height: "100vh",
          position: "relative",
          backgroundColor: "#000",
        }}
      >
        <CountryImages images={country.wikiData?.images} />
      </Box>
    </Box>
  );
};

export default CountryDetailsPage;
