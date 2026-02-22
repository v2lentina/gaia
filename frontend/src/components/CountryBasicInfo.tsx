import { Card, CardContent, Typography, Box } from "@mui/material";
import type { RestCountriesData } from "../types/api";
import InfoRow from "./InfoRow";

const CountryBasicInfo = ({ country }: { country: RestCountriesData }) => {
  const formatCurrencies = () => {
    if (!country.currencies) return "No currencies available";
    return Object.entries(country.currencies)
      .map(([code, currency]) => `${currency.name} (${code})`)
      .join(", ");
  };

  const infoItems = [
    { label: "Official Name", value: country.name.official },
    { label: "Capital", value: country.capital?.join(", ") },
    { label: "Region", value: country.region },
    { label: "Subregion", value: country.subregion },
    { label: "Borders", value: country.borders?.join(", ") },
    { label: "Continent", value: country.continents?.join(", ") },
    { label: "Landlocked", value: country.landlocked ? "Yes" : "No" },
    {
      label: "Population",
      value: country.population?.toLocaleString(),
    },
    {
      label: "Area",
      value: country.area ? `${country.area.toLocaleString()} km²` : undefined,
    },
    {
      label: "Languages",
      value: country.languages
        ? Object.values(country.languages).join(", ")
        : undefined,
    },
    { label: "Currencies", value: formatCurrencies() },
    { label: "Timezones", value: country.timezones?.join(", ") },
    { label: "Independent", value: country.independent ? "Yes" : "No" },
    { label: "UN Member", value: country.unMember ? "Yes" : "No" },
  ].filter((item): item is { label: string; value: string } => !!item.value);

  return (
    <Box>
      {/* Header with Flag */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
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
            border: "1px solid #ccc",
          }}
        />
      </Box>

      {/* Basic Information */}
      <Card>
        <CardContent>
          {infoItems.map((item) => (
            <InfoRow key={item.label} label={item.label} value={item.value} />
          ))}
        </CardContent>
      </Card>
    </Box>
  );
};

export default CountryBasicInfo;
