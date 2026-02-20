import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useState, useEffect } from "react";
import { getCountrySummary } from "../api/countryService";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ReactMarkdown from "react-markdown";

interface CountrySummaryProps {
  countryName: string;
}

const CountrySummary = ({ countryName }: CountrySummaryProps) => {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);

  useEffect(() => {
    const loadSummary = async () => {
      if (!countryName) return;

      setLoading(true);
      setError(null);

      try {
        const result = await getCountrySummary(countryName);
        setSummary(result.summary);
        setFromCache(result.fromCache);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load summary");
        console.error("Error loading summary:", err);
      } finally {
        setLoading(false);
      }
    };

    loadSummary();
  }, [countryName]);

  if (loading) {
    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <CircularProgress size={24} />
            <Typography variant="body1" color="text.secondary">
              Generating AI summary...
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Alert severity="warning">{error}</Alert>
        </CardContent>
      </Card>
    );
  }

  if (!summary) {
    return null;
  }

  return (
    <Card sx={{}}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <AutoAwesomeIcon sx={{ color: "#000" }} />
          <Typography variant="h6" sx={{ color: "#000", fontWeight: 600 }}>
            AI-Generated Summary
          </Typography>
          {fromCache && (
            <Typography
              variant="caption"
              sx={{ color: "rgba(0,0,0,0.8)", ml: "auto" }}
            >
              (cached)
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            color: "#000",
            lineHeight: 1.8,
            "& h1, & h2, & h3": {
              marginTop: 2,
              marginBottom: 1,
              fontWeight: 600,
            },
            "& h1": { fontSize: "1.75rem" },
            "& h2": { fontSize: "1.5rem" },
            "& h3": { fontSize: "1.25rem" },
            "& p": {
              marginBottom: 1,
            },
            "& ul, & ol": {
              paddingLeft: 3,
              marginBottom: 1,
            },
            "& li": {
              marginBottom: 0.5,
            },
            "& strong": {
              fontWeight: 600,
              color: "#1976d2",
            },
            "& em": {
              fontStyle: "italic",
            },
          }}
        >
          <ReactMarkdown>{summary}</ReactMarkdown>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CountrySummary;
