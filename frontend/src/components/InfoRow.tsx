import { Typography } from "@mui/material";

interface InfoRowProps {
  label: string;
  value: string | number;
}

const InfoRow = ({ label, value }: InfoRowProps) => (
  <Typography variant="body1" sx={{ mb: 1 }}>
    <strong>{label}:</strong> {value}
  </Typography>
);

export default InfoRow;
