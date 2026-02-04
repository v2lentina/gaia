import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import type { WikiDataFields } from "../types/api";

// Reusable info row component
const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <Typography variant="body1" sx={{ mb: 1 }}>
    <strong>{label}:</strong> {value}
  </Typography>
);

const CountryWikiData = ({
  wikiData,
  loading,
}: {
  wikiData?: WikiDataFields;
  loading?: boolean;
}) => {
  if (loading) {
    return (
      <Card sx={{ boxShadow: 0 }}>
        <CardContent
          sx={{ textAlign: "center", py: 4, "&:last-child": { pb: 4 } }}
        >
          <CircularProgress size={40} />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Loading additional information...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (!wikiData) {
    return null;
  }

  // Build info items dynamically
  const infoItems: { label: string; value: string | number }[] = [];

  if (wikiData.religions?.length) {
    infoItems.push({
      label: "Religions",
      value: wikiData.religions.join(", "),
    });
  }
  if (wikiData.ethnicGroups?.length) {
    infoItems.push({
      label: "Ethnic Groups",
      value: wikiData.ethnicGroups.join(", "),
    });
  }
  if (wikiData.governmentType?.trim()) {
    infoItems.push({ label: "Government", value: wikiData.governmentType });
  }
  if (wikiData.hdi) {
    infoItems.push({ label: "HDI", value: wikiData.hdi.toFixed(3) });
  }
  if (wikiData.gdpPerCapita) {
    infoItems.push({
      label: "GDP per Capita",
      value: `$${wikiData.gdpPerCapita.toLocaleString()}`,
    });
  }
  if (wikiData.lifeExpectancy) {
    infoItems.push({
      label: "Life Expectancy",
      value: `${wikiData.lifeExpectancy.toFixed(1)} years`,
    });
  }
  if (wikiData.literacyRate) {
    infoItems.push({
      label: "Literacy Rate",
      value: `${wikiData.literacyRate.toFixed(1)}%`,
    });
  }

  if (infoItems.length === 0) {
    return null;
  }

  return (
    <Card sx={{ boxShadow: 0 }}>
      <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
        {infoItems.map((item) => (
          <InfoRow key={item.label} label={item.label} value={item.value} />
        ))}
      </CardContent>
    </Card>
  );
};

export default CountryWikiData;
