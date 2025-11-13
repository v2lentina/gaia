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
} from "@mui/material";
import { useParams } from "react-router-dom";
import { getCountryByCode } from "../api/countries";
import type { CountryDetails } from "../types/api";

const CountryDetails = () => {
  const { code } = useParams<{ code: string }>();
  const [country, setCountry] = useState<CountryDetails | null>(null); // or undefined? or sth
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCountry = async () => {
      if (!code) return;

      setLoading(true);

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
  }, [code]); // ependency array - execute when 'code' changes

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
    <Container maxWidth="lg" sx={{ py: 4, px: { xs: 1, sm: 2 } }}>
      <Box
        sx={{
          display: "flex",
          gap: 3,
          justifyContent: "center",
          alignItems: "flex-start",
          minWidth: "600px",
        }}
      >
        {/* Left Side: Images */}
        <Box
          sx={{
            flex: "0 0 50%",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            maxWidth: 600,
            mx: "auto",
          }}
        >
          <Card sx={{ height: "fit-content" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Country Images
              </Typography>
              {country.wikiData?.images &&
              country.wikiData.images.length > 0 ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    maxHeight: "500px",
                    overflowY: "auto",
                  }}
                >
                  {country.wikiData.images
                    .filter((img) => {
                      const title = img.title.toLowerCase();
                      const mediatype = img.preferred?.mediatype;

                      // Only show real photographs (BITMAP), not icons/logos
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
                      ); // Bigger images only
                    })
                    .slice(0, 8) // Show max 8 real photos
                    .map((image, index) => (
                      <Box key={index} sx={{ mb: 2 }}>
                        <img
                          src={`https:${image.preferred?.url}`}
                          alt={image.title}
                          style={{
                            width: "100%",
                            maxHeight: "200px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            border: "1px solid #ddd",
                          }}
                        />
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ mt: 0.5, display: "block" }}
                        >
                          {image.title}
                        </Typography>
                      </Box>
                    ))}
                </Box>
              ) : (
                <Box
                  sx={{
                    height: "200px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px dashed #ccc",
                    borderRadius: 1,
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <Typography color="text.secondary">
                    🏞️ No images available
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* Right Side: Details */}
        <Box
          sx={{
            flex: "0 0 50%",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            maxWidth: 600,
          }}
        >
          <Card>
            <CardContent sx={{ padding: 2 }}>
              <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
                {country.name.common} ({country.cca3})
              </Typography>
              <Box sx={{ mb: 2 }}>
                <img
                  src={country.flags.svg}
                  alt={`Flag of ${country.name.common}`}
                  style={{ width: "80px", marginBottom: "8px" }}
                />
              </Box>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <strong>Official Name:</strong> {country.name.official}
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <strong>Capital:</strong> {country.capital?.join(", ") || "N/A"}
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <strong>Region:</strong> {country.region || "N/A"}
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <strong>Subregion:</strong> {country.subregion || "N/A"}
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <strong>Population:</strong>{" "}
                {country.population?.toLocaleString() || "N/A"}
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <strong>Area:</strong> {country.area?.toLocaleString() || "N/A"}{" "}
                km²
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <strong>Languages:</strong>{" "}
                {country.languages
                  ? Object.values(country.languages).join(", ")
                  : "N/A"}
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <strong>Currencies:</strong>{" "}
                {country.currencies
                  ? Object.values(country.currencies)
                      .map((curr) =>
                        curr.symbol
                          ? `${curr.name} (${curr.symbol})`
                          : curr.name
                      )
                      .join(", ")
                  : "N/A"}
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <strong>Timezones:</strong>{" "}
                {country.timezones?.join(", ") || "N/A"}
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <strong>Continents:</strong>{" "}
                {country.continents?.join(", ") || "N/A"}
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <strong>Landlocked:</strong> {country.landlocked ? "Yes" : "No"}
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <strong>Borders:</strong>{" "}
                {country.borders?.length ? country.borders.join(", ") : "None"}
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <strong>Independent:</strong>{" "}
                {country.independent ? "Yes" : "No"}
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <strong>UN Member:</strong> {country.unMember ? "Yes" : "No"}
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <strong>Coat of Arms:</strong>{" "}
                {country.coatOfArms?.svg ? (
                  <img
                    src={country.coatOfArms.svg}
                    alt={`Coat of Arms of ${country.name.common}`}
                    style={{ width: "80px", marginBottom: "8px" }}
                  />
                ) : (
                  "N/A"
                )}
              </Typography>
            </CardContent>
          </Card>

          {/* WikiData Card */}
          {country.wikiData && (
            <Card>
              <CardContent sx={{ padding: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ mb: 1.5 }}>
                  WikiData Information
                </Typography>

                {country.wikiData.religions && (
                  <Typography sx={{ mb: 1 }}>
                    <strong>Religions:</strong>{" "}
                    {country.wikiData.religions.join(", ")}
                  </Typography>
                )}

                {country.wikiData.ethnicGroups && (
                  <Typography sx={{ mb: 1 }}>
                    <strong>Ethnic Groups:</strong>{" "}
                    {country.wikiData.ethnicGroups.join(", ")}
                  </Typography>
                )}

                {country.wikiData.governmentType && (
                  <Typography sx={{ mb: 1 }}>
                    <strong>Government Type:</strong>{" "}
                    {country.wikiData.governmentType}
                  </Typography>
                )}

                {country.wikiData.hdi && (
                  <Typography sx={{ mb: 1 }}>
                    <strong>HDI:</strong> {country.wikiData.hdi}
                  </Typography>
                )}

                {country.wikiData.gdpPerCapita && (
                  <Typography sx={{ mb: 1 }}>
                    <strong>GDP per Capita:</strong> $
                    {country.wikiData.gdpPerCapita.toLocaleString()}
                  </Typography>
                )}

                {country.wikiData.lifeExpectancy && (
                  <Typography sx={{ mb: 1 }}>
                    <strong>Life Expectancy:</strong>{" "}
                    {country.wikiData.lifeExpectancy} years
                  </Typography>
                )}

                {country.wikiData.literacyRate && (
                  <Typography sx={{ mb: 1 }}>
                    <strong>Literacy Rate:</strong>{" "}
                    {country.wikiData.literacyRate}%
                  </Typography>
                )}
              </CardContent>
            </Card>
          )}

          {/* Debug Info */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Debug Info (Raw Data)
              </Typography>
              <Box
                component="pre"
                sx={{
                  backgroundColor: "#f5f5f5",
                  p: 2,
                  borderRadius: 1,
                  overflow: "auto",
                  maxHeight: "300px",
                  fontSize: "0.8rem",
                }}
              >
                {JSON.stringify(country, null, 2)}
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
};

export default CountryDetails;
