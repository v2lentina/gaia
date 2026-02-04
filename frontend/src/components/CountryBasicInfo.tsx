import { Card, CardContent, Typography, Box } from "@mui/material";
import type { RestCountriesData } from "../types/api";

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <Typography variant="body1" sx={{ mb: 1 }}>
    <strong>{label}:</strong> {value}
  </Typography>
);

const CountryBasicInfo = ({ country }: { country: RestCountriesData }) => {
  const formatCurrencies = () => {
    if (!country.currencies) return "N/A";
    return Object.entries(country.currencies)
      .map(([code, currency]) => `${currency.name} (${code})`)
      .join(", ");
  };

  const infoItems = [
    { label: "Official Name", value: country.name.official },
    { label: "Capital", value: country.capital?.join(", ") || "N/A" },
    { label: "Region", value: country.region || "N/A" },
    { label: "Subregion", value: country.subregion || "N/A" },
    { label: "Borders", value: country.borders?.join(", ") || "N/A" },
    { label: "Continent", value: country.continents?.join(", ") || "N/A" },
    { label: "Landlocked", value: country.landlocked ? "Yes" : "No" },
    {
      label: "Population",
      value: country.population?.toLocaleString() || "N/A",
    },
    { label: "Area", value: `${country.area?.toLocaleString() || "N/A"} km²` },
    {
      label: "Languages",
      value: country.languages
        ? Object.values(country.languages).join(", ")
        : "N/A",
    },
    { label: "Currencies", value: formatCurrencies() },
    { label: "Timezones", value: country.timezones?.join(", ") || "N/A" },
    { label: "Independent", value: country.independent ? "Yes" : "No" },
    { label: "UN Member", value: country.unMember ? "Yes" : "No" },
  ];

  return (
    <Box>
      {/* Header with Flag */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            {country.name?.common}
          </Typography>
          <Typography variant="h6" color="text.secondary">
            {country.name?.official}
          </Typography>
        </Box>
        <Box
          component="img"
          src={country.flags?.svg}
          alt={`Flag of ${country.name?.common}`}
          sx={{
            width: 240,
            objectFit: "cover",
            ml: 2.5,
            border: "1px solid #ccc",
          }}
        />
      </Box>

      {/* Basic Information */}
      <Card sx={{ boxShadow: 0 }}>
        <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
          {infoItems.map((item) => (
            <InfoRow key={item.label} label={item.label} value={item.value} />
          ))}
        </CardContent>
      </Card>
    </Box>
  );
};

export default CountryBasicInfo;
