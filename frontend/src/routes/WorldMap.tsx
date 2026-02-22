import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { useNavigate } from "react-router-dom";
import { Container, Box } from "@mui/material";

const geoUrl = `${import.meta.env.BASE_URL}ne_10m_admin_0_countries_lakes.json`;

type GeoProperties = {
  ADM0_A3?: string; // 3 letter country code
  ISO_A3?: string; // fallback
  NAME_EN?: string;
  NAME_LONG?: string;
  NAME?: string;
  name?: string; // fallback
  [key: string]: any;
};

const WorldMap = () => {
  const navigate = useNavigate();

  const handleCountryClick = (geo: any) => {
    const props: GeoProperties = geo.properties ?? {};
    const countryCode = props.ADM0_A3 || props.ISO_A3;

    if (countryCode) {
      navigate(`/country/${countryCode.toUpperCase()}`);
    }
  };

  const getCountryName = (props: GeoProperties): string =>
    props.NAME_LONG || props.NAME_EN || props.NAME || props.name || "";

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        height: "calc(100vh - 64px)", // Full viewport height minus header
        margin: 0,
        padding: 0,
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "100%",
          margin: 0,
          padding: 0,
          overflow: "hidden",
        }}
      >
        <ComposableMap
          projection="geoEquirectangular"
          projectionConfig={{
            scale: 180,
            center: [0, 0],
          }}
          style={{
            width: "100%",
            height: "100%",
            display: "block",
          }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo: any) => {
                const props: GeoProperties = geo.properties ?? {};
                console.log(geo.properties);
                const name = getCountryName(props);

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => handleCountryClick(geo)}
                    data-tooltip-id="country-tooltip"
                    data-tooltip-content={name}
                    style={{
                      default: {
                        fill: "#D6D6DA",
                        outline: "none",
                        stroke: "#999",
                        strokeWidth: 0.4,
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
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </Box>
    </Container>
  );
};

export default WorldMap;
