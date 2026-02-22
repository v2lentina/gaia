import { lazy, Suspense } from "react";
import { Box, CircularProgress, Alert, Typography } from "@mui/material";
import { useLoaderData, LoaderFunctionArgs } from "react-router-dom";
import { getCountryByCode } from "../api/countryService";
import type { CountryDetails } from "../types/api";
import CountryBasicInfo from "../components/CountryBasicInfo";
import CountryWikiData from "../components/CountryWikiData";
import CountryImages from "../components/CountryImages";
import CountrySummary from "../components/CountrySummary";
import { HEADER_HEIGHT } from "../components/Header";

const WeatherApp = lazy(() =>
  import("weatherRemote/WeatherApp").catch(() => ({
    default: () => (
      <Alert severity="warning">Failed to load Weather Widget</Alert>
    ),
  }))
);

/**
 * Loader function - runs BEFORE component renders
 * Fetches country data based on route parameter
 */
export const countryLoader = async ({ params }: LoaderFunctionArgs) => {
  const code = params.code;

  if (!code) {
    throw new Response(
      "Country code is required to fetch country information",
      { status: 400 }
    );
  }

  try {
    const countryData = await getCountryByCode(code.toUpperCase());
    return countryData;
  } catch (error) {
    console.error("Error loading country data:", error);
    throw new Response("Country not found", { status: 404 });
  }
};

const CountryDetailsPage = () => {
  const country = useLoaderData() as CountryDetails;

  return (
    <Box
      sx={{
        height: `calc(100vh - ${HEADER_HEIGHT}px)`,
        display: "flex",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          flex: "0 0 50%",
          overflowY: "auto",
          height: `calc(100vh - ${HEADER_HEIGHT}px)`,
          padding: "32px 24px",
        }}
      >
        <Box sx={{ maxWidth: 600, mx: "auto" }}>
          <CountryBasicInfo country={country} />

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
              Additional Information
            </Typography>
            <CountryWikiData wikiData={country.wikiData} />
          </Box>

          <CountrySummary countryName={country.name.common} />

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
          height: `calc(100vh - ${HEADER_HEIGHT}px)`,
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
