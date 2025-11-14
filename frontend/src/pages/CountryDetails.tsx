// CountryDetails.tsx
import { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  Stack,
  IconButton,
} from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { getCountryByCode } from "../api/countries";
import type { CountryDetails } from "../types/api";

const CountryDetails = () => {
  const { code } = useParams<{ code: string }>();
  const [country, setCountry] = useState<CountryDetails | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCountry = async () => {
      if (!code) return;

      setLoading(true);
      setCurrentImageIndex(0); // Reset image index when loading new country

      try {
        const countryData = await getCountryByCode(code.toUpperCase());
        setCountry(countryData);
      } catch (error) {
        console.error("Error loading country:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCountry();
  }, [code]); // Dependency array - execute when 'code' changes

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
          <Card sx={{ boxShadow: 0 }}>
            <CardContent sx={{ padding: 3 }}>
              <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
                {country.name.common} ({country.cca3})
              </Typography>
              <Box sx={{ mb: 3 }}>
                <img
                  src={country.flags.svg}
                  alt={`Flag of ${country.name.common}`}
                  style={{
                    width: "180px",
                    marginBottom: "16px",
                    border: "1px solid #ccc",
                  }}
                />
              </Box>
              <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
                Basic Information
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Official Name:</strong> {country.name.official}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Capital:</strong> {country.capital?.join(", ") || "N/A"}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Region:</strong> {country.region || "N/A"}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Subregion:</strong> {country.subregion || "N/A"}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Borders:</strong> {country.borders?.join(", ") || "N/A"}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Continent:</strong>{" "}
                {country.continents?.join(", ") || "N/A"}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Landlocked:</strong> {country.landlocked ? "Yes" : "No"}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Population:</strong>{" "}
                {country.population?.toLocaleString() || "N/A"}
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                <strong>Area:</strong> {country.area?.toLocaleString() || "N/A"}{" "}
                km²
              </Typography>

              <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
                Languages & Culture
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Languages:</strong>{" "}
                {country.languages
                  ? Object.values(country.languages).join(", ")
                  : "N/A"}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Currencies:</strong>{" "}
                {country.currencies
                  ? Object.entries(country.currencies)
                      .map(([code, currency]) => `${currency.name} (${code})`)
                      .join(", ")
                  : "N/A"}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Timezones:</strong>{" "}
                {country.timezones?.join(", ") || "N/A"}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>independent:</strong>{" "}
                {country.independent ? "Yes" : "No"}
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                <strong>unMember:</strong> {country.unMember ? "Yes" : "No"}
              </Typography>

              {country.wikiData &&
                ((country.wikiData.religions &&
                  country.wikiData.religions.length > 0) ||
                  (country.wikiData.ethnicGroups &&
                    country.wikiData.ethnicGroups.length > 0) ||
                  (country.wikiData.governmentType &&
                    country.wikiData.governmentType.trim().length > 0) ||
                  country.wikiData.hdi ||
                  country.wikiData.gdpPerCapita ||
                  country.wikiData.lifeExpectancy ||
                  country.wikiData.literacyRate) && (
                  <>
                    <Typography
                      variant="h6"
                      sx={{ mb: 2, color: "primary.main" }}
                    >
                      Additional Information
                    </Typography>
                    {country.wikiData.religions &&
                      country.wikiData.religions.length > 0 && (
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          <strong>Religions:</strong>{" "}
                          {country.wikiData.religions.join(", ")}
                        </Typography>
                      )}
                    {country.wikiData.ethnicGroups &&
                      country.wikiData.ethnicGroups.length > 0 && (
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          <strong>Ethnic Groups:</strong>{" "}
                          {country.wikiData.ethnicGroups.join(", ")}
                        </Typography>
                      )}
                    {country.wikiData.governmentType &&
                      country.wikiData.governmentType.trim().length > 0 && (
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          <strong>Government:</strong>{" "}
                          {country.wikiData.governmentType}
                        </Typography>
                      )}
                    {country.wikiData.hdi && (
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>HDI:</strong> {country.wikiData.hdi.toFixed(3)}
                      </Typography>
                    )}
                    {country.wikiData.gdpPerCapita && (
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>GDP per Capita:</strong> $
                        {country.wikiData.gdpPerCapita.toLocaleString()}
                      </Typography>
                    )}
                    {country.wikiData.lifeExpectancy && (
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>Life Expectancy:</strong>{" "}
                        {country.wikiData.lifeExpectancy.toFixed(1)} years
                      </Typography>
                    )}
                    {country.wikiData.literacyRate && (
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>Literacy Rate:</strong>{" "}
                        {country.wikiData.literacyRate.toFixed(1)}%
                      </Typography>
                    )}
                  </>
                )}
            </CardContent>
          </Card>
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
        {country.wikiData?.images && country.wikiData.images.length > 0 ? (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {(() => {
              // Filter images once
              const filteredImages = country.wikiData.images.filter((img) => {
                const title = img.title.toLowerCase();
                const mediatype = img.preferred?.mediatype;

                return (
                  mediatype === "BITMAP" &&
                  !title.includes("logo") &&
                  !title.includes("icon") &&
                  !title.includes("commons") &&
                  !title.includes("cscr-featured") &&
                  !title.includes("oojs") &&
                  !title.includes("semi-protection") &&
                  !title.includes("wiktionary") &&
                  (img.preferred?.width || 0) > 200
                );
              });

              if (filteredImages.length === 0) {
                return (
                  <Box sx={{ color: "white", fontSize: "18px" }}>
                    No images available
                  </Box>
                );
              }

              const currentImage =
                filteredImages[currentImageIndex] || filteredImages[0];

              return (
                <>
                  <img
                    src={`https:${currentImage.preferred?.url}`}
                    alt={currentImage.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
                  />

                  {filteredImages.length > 1 && (
                    <>
                      <IconButton
                        onClick={() =>
                          setCurrentImageIndex(
                            currentImageIndex === 0
                              ? filteredImages.length - 1
                              : currentImageIndex - 1
                          )
                        }
                        sx={{
                          position: "absolute",
                          left: 20,
                          top: "50%",
                          transform: "translateY(-50%)",
                          backgroundColor: "rgba(0,0,0,0.6)",
                          color: "white",
                          "&:hover": {
                            backgroundColor: "rgba(0,0,0,0.8)",
                          },
                        }}
                      >
                        <ArrowBack />
                      </IconButton>

                      <IconButton
                        onClick={() =>
                          setCurrentImageIndex(
                            currentImageIndex === filteredImages.length - 1
                              ? 0
                              : currentImageIndex + 1
                          )
                        }
                        sx={{
                          position: "absolute",
                          right: 20,
                          top: "50%",
                          transform: "translateY(-50%)",
                          backgroundColor: "rgba(0,0,0,0.6)",
                          color: "white",
                          "&:hover": {
                            backgroundColor: "rgba(0,0,0,0.8)",
                          },
                        }}
                      >
                        <ArrowForward />
                      </IconButton>
                    </>
                  )}

                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 20,
                      right: 20,
                      backgroundColor: "rgba(0,0,0,0.7)",
                      color: "white",
                      px: 2,
                      py: 1,
                      borderRadius: 1,
                      fontSize: "14px",
                    }}
                  >
                    {currentImageIndex + 1} / {filteredImages.length}
                  </Box>

                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 20,
                      left: 20,
                      backgroundColor: "rgba(0,0,0,0.7)",
                      color: "white",
                      px: 2,
                      py: 1,
                      borderRadius: 1,
                      fontSize: "12px",
                      maxWidth: "300px",
                    }}
                  >
                    {currentImage.title}
                  </Box>
                </>
              );
            })()}
          </Box>
        ) : (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "18px",
            }}
          >
            No images available
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CountryDetails;
