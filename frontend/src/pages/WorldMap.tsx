import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { useNavigate } from "react-router-dom";
import { Container, Box } from "@mui/material";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";

interface GeographyData {
  rsmKey: string;
  properties: {
    ISO_A3: string;
    [key: string]: any;
  };
}

const WorldMap = () => {
  const navigate = useNavigate();

  const handleCountryClick = (geo: GeographyData) => {
    const countryCode = geo.properties.ISO_A3;
    if (countryCode) {
      navigate(`/country/${countryCode.toLowerCase()}`);
    }
  };

  return (
    <Container>
      <Box>
        <ComposableMap
          projection="geoNaturalEarth1"
          projectionConfig={{
            scale: 147,
            center: [0, 0],
          }}
          style={{ width: "100%", height: "100%" }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }: { geographies: GeographyData[] }) =>
              geographies.map((geo: GeographyData) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => handleCountryClick(geo)}
                  style={{
                    default: {
                      fill: "#D6D6DA",
                      outline: "none",
                    },
                    hover: {
                      fill: "#2F70E0",
                      outline: "none",
                      cursor: "pointer",
                    },
                    pressed: {
                      fill: "#1A5FB4",
                      outline: "none",
                    },
                  }}
                />
              ))
            }
          </Geographies>
        </ComposableMap>
      </Box>
    </Container>
  );
};

export default WorldMap;
