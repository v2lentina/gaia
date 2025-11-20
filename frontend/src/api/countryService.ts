// countryService.ts includes all api calls related to countries
import axios from "axios";
import type {
  Country,
  RestCountriesData,
  WikiDataFields,
  CountryDetails,
  WikipediaImage,
} from "../types/api";

const REST_COUNTRIES_BASE = "https://restcountries.com/v3.1";
const WIKIDATA_SPARQL_URL = "https://query.wikidata.org/sparql";
const WIKIPEDIA_MEDIA_BASE =
  "https://api.wikimedia.org/core/v1/wikipedia/en/page";

const buildBasicWikiDataQuery = (cca3: string) =>
  `
SELECT ?item ?itemLabel
       (SAMPLE(?hdiVal) AS ?hdi)
       (SAMPLE(?gdpVal) AS ?gdpPerCapita)
       (SAMPLE(?lifeVal) AS ?lifeExpectancy)
       (SAMPLE(?litVal) AS ?literacyRate)
       (SAMPLE(?govLabel) AS ?governmentType)
       (SAMPLE(?enTitle) AS ?enwikiTitle)
WHERE {
  ?item wdt:P298 "${cca3}".
  OPTIONAL { ?item wdt:P122 ?gov . ?gov rdfs:label ?govLabel . FILTER(LANG(?govLabel)="en") }
  
  OPTIONAL { ?item p:P1081/ps:P1081 ?hdiVal }
  OPTIONAL { ?item p:P2132/ps:P2132 ?gdpVal }
  OPTIONAL { ?item p:P2250/ps:P2250 ?lifeVal }
  OPTIONAL { ?item p:P6897/ps:P6897 ?litVal }
  OPTIONAL {
    ?enwiki schema:about ?item ;
            schema:isPartOf <https://en.wikipedia.org/> ;
            schema:name ?enTitle .
  }

  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
GROUP BY ?item ?itemLabel
LIMIT 1
`.trim();

const buildExtraWikiDataQuery = (cca3: string) =>
  `
SELECT ?item
       (GROUP_CONCAT(DISTINCT ?religionLabel; separator=", ") AS ?religions)
       (GROUP_CONCAT(DISTINCT ?ethnicLabel; separator=", ") AS ?ethnicGroups)
WHERE {
  ?item wdt:P298 "${cca3}".
  OPTIONAL { ?item wdt:P140 ?religion . ?religion rdfs:label ?religionLabel . FILTER(LANG(?religionLabel)="en") }
  OPTIONAL { ?item wdt:P172 ?ethnic . ?ethnic rdfs:label ?ethnicLabel . FILTER(LANG(?ethnicLabel)="en") }

  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
GROUP BY ?item
LIMIT 1
`.trim();

async function fetchWikipediaImages(
  wikipediaTitle: string
): Promise<WikipediaImage[]> {
  try {
    const url = `${WIKIPEDIA_MEDIA_BASE}/${encodeURIComponent(
      wikipediaTitle
    )}/links/media`;

    const response = await axios.get(url, {
      headers: {
        Accept: "application/json",
      },
      timeout: 8000,
    });

    const files = response.data?.files || [];

    return files.filter(
      (file: any) =>
        file.preferred?.mediatype === "BITMAP" ||
        file.preferred?.mediatype === "DRAWING"
    );
  } catch (error) {
    console.warn(
      `Failed to fetch Wikipedia images for "${wikipediaTitle}":`,
      (error as Error).message
    );
    return [];
  }
}

async function fetchWikiDataByCCA3(cca3: string): Promise<WikiDataFields> {
  const headers = {
    Accept: "application/sparql-results+json",
  };

  try {
    const [fastResult, slowResult] = await Promise.allSettled([
      axios.get(WIKIDATA_SPARQL_URL, {
        params: { query: buildBasicWikiDataQuery(cca3), format: "json" },
        headers,
        timeout: 8000,
      }),
      axios.get(WIKIDATA_SPARQL_URL, {
        params: { query: buildExtraWikiDataQuery(cca3), format: "json" },
        headers,
        timeout: 15000,
      }),
    ]);

    // Fast Data (numeric + gov + enwiki title)
    let fastData: any = {};
    if (fastResult.status === "fulfilled") {
      const fastRow = fastResult.value.data?.results?.bindings?.[0];
      if (fastRow) {
        const get = (k: string) => fastRow[k]?.value as string | undefined;
        const parseNum = (k: string) => (get(k) ? Number(get(k)) : undefined);

        fastData = {
          governmentType: get("governmentType"),
          hdi: parseNum("hdi"),
          gdpPerCapita: parseNum("gdpPerCapita"),
          lifeExpectancy: parseNum("lifeExpectancy"),
          literacyRate: parseNum("literacyRate"),
          enwikiTitle: get("enwikiTitle"),
        };
      }
    } else {
      console.warn("Fast WikiData query failed:", fastResult.reason);
    }

    // Slow Data (religions + ethnic groups)
    let slowData: any = {};
    if (slowResult.status === "fulfilled") {
      const slowRow = slowResult.value.data?.results?.bindings?.[0];
      if (slowRow) {
        const get = (k: string) => slowRow[k]?.value as string | undefined;

        slowData = {
          religions: get("religions")?.split(", ").filter(Boolean),
          ethnicGroups: get("ethnicGroups")?.split(", ").filter(Boolean),
        };
      }
    } else {
      console.warn("Slow WikiData query failed:", slowResult.reason);
    }

    let images: WikipediaImage[] = [];
    if (fastData.enwikiTitle) {
      try {
        images = await fetchWikipediaImages(fastData.enwikiTitle);
      } catch (imageError) {
        console.warn(
          "Wikipedia images fetch failed:",
          (imageError as Error).message
        );
      }
    }

    return {
      ...fastData,
      ...slowData,
      images,
    };
  } catch (error) {
    console.error(
      "WikiData fetch failed completely:",
      (error as Error).message
    );
    return {};
  }
}

async function fetchRestDataByCCA3(cca3: string): Promise<RestCountriesData> {
  const response = await axios.get<RestCountriesData[]>(
    `${REST_COUNTRIES_BASE}/alpha/${cca3.toUpperCase()}`
  );

  if (!response.data.length) {
    throw new Error(`Country with code '${cca3.toUpperCase()}' not found`);
  }

  return response.data[0];
}

export const searchCountriesByName = async (
  searchTerm: string
): Promise<Country[]> => {
  if (!searchTerm.trim()) return [];

  const q = searchTerm.trim();
  const response = await axios.get<Country[]>(
    `${REST_COUNTRIES_BASE}/name/${encodeURIComponent(
      q
    )}?fields=name,flags,cca3`
  );

  const term = q.toLowerCase();
  const filtered = response.data.filter((country) => {
    const englishName = country.name?.common?.toLowerCase() || "";
    return englishName.startsWith(term);
  });

  return filtered;
};

export const getRestCountriesData = async (
  code: string
): Promise<RestCountriesData> => {
  if (!code.trim()) throw new Error("Invalid country code");
  return fetchRestDataByCCA3(code);
};

export const getWikiData = async (code: string): Promise<WikiDataFields> => {
  if (!code.trim()) throw new Error("Invalid country code");
  return fetchWikiDataByCCA3(code.toUpperCase());
};

export const getCountryByCode = async (
  code: string
): Promise<CountryDetails> => {
  if (!code.trim()) throw new Error("Invalid country code");

  const cca3 = code.toUpperCase();

  const [restResult, wikiResult] = await Promise.allSettled([
    fetchRestDataByCCA3(cca3),
    fetchWikiDataByCCA3(cca3),
  ]);

  if (restResult.status === "rejected") {
    throw restResult.reason;
  }

  const wikiData =
    wikiResult.status === "fulfilled" ? wikiResult.value : undefined;

  // CountryDetails = RestCountriesData & { wikiData?: WikiDataFields }
  const combined: CountryDetails = {
    ...(restResult.value as RestCountriesData),
    wikiData,
  };

  return combined;
};
