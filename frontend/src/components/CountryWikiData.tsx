import { Card, CardContent } from "@mui/material";
import type { WikiDataFields } from "../types/api";
import InfoRow from "./InfoRow";

const CountryWikiData = ({ wikiData }: { wikiData?: WikiDataFields }) => {
  if (!wikiData) {
    return null;
  }

  const infoItems = [
    {
      label: "Religions",
      value: wikiData.religions?.join(", "),
    },
    {
      label: "Ethnic Groups",
      value: wikiData.ethnicGroups?.join(", "),
    },
    {
      label: "Government",
      value: wikiData.governmentType,
    },
    {
      label: "HDI",
      value: wikiData.hdi?.toFixed(3),
    },
    {
      label: "GDP per Capita",
      value: wikiData.gdpPerCapita
        ? `$${wikiData.gdpPerCapita.toLocaleString()}`
        : undefined,
    },
    {
      label: "Life Expectancy",
      value: wikiData.lifeExpectancy
        ? `${wikiData.lifeExpectancy.toFixed(1)} years`
        : undefined,
    },
    {
      label: "Literacy Rate",
      value: wikiData.literacyRate
        ? `${wikiData.literacyRate.toFixed(1)}%`
        : undefined,
    },
  ].filter((item) => !!item.value) as {
    label: string;
    value: string | number;
  }[];

  if (infoItems.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardContent>
        {infoItems.map((item) => (
          <InfoRow key={item.label} label={item.label} value={item.value} />
        ))}
      </CardContent>
    </Card>
  );
};

export default CountryWikiData;
