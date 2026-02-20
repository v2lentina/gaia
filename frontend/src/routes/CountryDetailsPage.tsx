import { useState, useEffect, lazy, Suspense } from "react";
import {
  Container,
  Box,
  CircularProgress,
  Alert,
  Typography,
  styled,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { getCountryByCode } from "../api/countryService";
import type { CountryDetails } from "../types/api";
import CountryBasicInfo from "../components/CountryBasicInfo";
import CountryWikiData from "../components/CountryWikiData";
import CountryImages from "../components/CountryImages";
import { HEADER_HEIGHT } from "../components/Header";

// Styled Components
const PageContainer = styled(Box)({
  height: `calc(100vh - ${HEADER_HEIGHT}px)`,
  display: "flex",
  overflow: "hidden",
});

const ContentPanel = styled(Box)({
  flex: "0 0 50%",
  overflowY: "auto",
  height: `calc(100vh - ${HEADER_HEIGHT}px)`,
  padding: "32px 24px",
});

const ImagePanel = styled(Box)({
  flex: "0 0 50%",
  height: `calc(100vh - ${HEADER_HEIGHT}px)`,
  position: "relative",
  backgroundColor: "#000",
});

const WeatherApp = lazy(() =>
  import("weatherRemote/WeatherApp").catch(() => ({
    default: () => (
      <Alert severity="warning">Failed to load Weather Widget</Alert>
    ),
  }))
);

const CountryDetailsPage = () => {
  const { code } = useParams<{ code: string }>();
  const [country, setCountry] = useState<CountryDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCountryData = async () => {
      if (!code) return;

      setLoading(true);

      try {
        const countryData = await getCountryByCode(code.toUpperCase());
        setCountry(countryData);
      } catch (error) {
        console.error("Error loading country data:", error);
      } finally {
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
    <PageContainer>
      <ContentPanel>
        <Box sx={{ maxWidth: 600, mx: "auto" }}>
          <CountryBasicInfo country={country} />

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
              Additional Information
            </Typography>
            <CountryWikiData wikiData={country.wikiData} />
          </Box>

          {country.capital?.[0] && (
            <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
              <Suspense fallback={<CircularProgress size={24} />}>
                <WeatherApp city={country.capital[0]} />
              </Suspense>
            </Box>
          )}
        </Box>
      </ContentPanel>

      <ImagePanel>
        <CountryImages images={country.wikiData?.images} />
      </ImagePanel>
    </PageContainer>
  );
};

export default CountryDetailsPage;
