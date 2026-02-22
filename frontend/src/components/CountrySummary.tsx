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

const CountrySummary = ({ countryName }: { countryName: string }) => {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);

  useEffect(() => {
    const loadSummary = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await getCountrySummary(countryName);
        setSummary(result.summary);
        setFromCache(result.fromCache);
      } catch (err) {
        setError("Unable to generate summary. Please try again later.");
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
      <Card>
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
    <Card>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <AutoAwesomeIcon sx={{ color: "primary.main" }} />
          <Typography
            variant="h6"
            sx={{ color: "primary.main", fontWeight: 600 }}
          >
            AI-Generated Summary
          </Typography>
          {fromCache && (
            <Typography
              variant="caption"
              sx={{ color: "secondary.main", ml: "auto" }}
            >
              (cached)
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            color: "primary.secondary",
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
