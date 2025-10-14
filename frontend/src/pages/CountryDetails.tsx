// CountryDetails.tsx
import { Container, Box, Typography } from "@mui/material";
import { useParams } from "react-router-dom";

const CountryDetails = () => {
  const { name } = useParams<{ name: string }>();

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Country Details: {name}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          This page is under development.
        </Typography>
      </Box>
    </Container>
  );
};

export default CountryDetails;
