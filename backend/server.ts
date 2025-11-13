import express, { Request, Response, NextFunction } from "express"; // Import express types
import cors from "cors";
import axios from "axios";
import {
  Country,
  RestCountriesData,
  WikiDataFields,
  WikipediaImage,
  CountryDetails,
  ApiError,
  ApiResponse,
} from "./types/api"; // Import api types

const app = express(); // Initialize express app
const PORT: number = parseInt(process.env.PORT || "5000"); // Define port

// Helper Functions
const createError = (
  statusCode: number,
  error: string,
  message?: string
): ApiError => {
  return {
    error,
    message,
    statusCode,
  };
};

const sendError = (
  res: Response,
  statusCode: number,
  error: string,
  message?: string
) => {
  res.status(statusCode).json(createError(statusCode, error, message));
};

const sendSuccess = <T>(res: Response, data: T) => {
  res.json({ success: true, data });
};

// Middleware - functions that run before every request
app.use(cors()); // Adds CORS headers to every response
app.use(express.json()); // Parses JSON bodies to JS objects

// Routes
app.get("/", (req: Request, res: Response<{ message: string }>) => {
  res.json({ message: "Gaia Backend API is running!" });
});

// Get countries by extract (basic search)
app.get(
  "/api/search",
  async (req: Request, res: Response<ApiResponse<Country[]>>) => {
    const { q } = req.query; // Extract query from URL

    if (!q || typeof q !== "string" || q.trim() === "") {
      console.log("Invalid search query received:", q);
      return sendError(
        res,
        400,
        "INVALID_QUERY",
        "Search query is required and cannot be empty"
      );
    }

    try {
      // REST Countries API Search
      const response = await axios.get<Country[]>(
        `https://restcountries.com/v3.1/name/${q}?fields=name,flags,cca3`
      );

      // Filter for countries whose english name starts with the query (case insensitive)
      const term = q.trim().toLowerCase();
      const filtered = response.data.filter((country) => {
        const englishName = country.name?.common?.toLowerCase() || "";

        return englishName.startsWith(term);
      });

      sendSuccess(res, filtered);
    } catch (error) {
      console.error("External API error:", (error as Error).message);

      const is404 = axios.isAxiosError(error) && error.response?.status === 404;
      sendError(
        res,
        is404 ? 404 : 500,
        is404 ? "NOT_FOUND" : "API_ERROR",
        is404 ? "No results found" : "Service temporarily unavailable"
      );
    }
  }
);

// Get country details from REST Countries API by CCA3 code
app.get(
  "/api/countries/:code/rest",
  async (req: Request, res: Response<ApiResponse<RestCountriesData>>) => {
    const { code } = req.params;

    if (!code || code.trim().length !== 3) {
      return sendError(
        res,
        400,
        "INVALID_CODE",
        "Country code must be a 3-letter CCA3 code"
      );
    }

    try {
      const restData = await fetchRestDataByCCA3(code);
      sendSuccess(res, restData);
    } catch (error) {
      console.error("REST Countries API error:", (error as Error).message);

      const is404 = axios.isAxiosError(error) && error.response?.status === 404;
      sendError(
        res,
        is404 ? 404 : 500,
        is404 ? "NOT_FOUND" : "API_ERROR",
        is404
          ? `Country with code '${code.toUpperCase()}' not found`
          : "REST Countries API temporarily unavailable"
      );
    }
  }
);

// WikiData SPARQL Helper Functions
const buildWikiDataQueryStringByCCA3 = (cca3: string) =>
  `
SELECT ?item ?itemLabel
       (SAMPLE(?hdiVal) AS ?hdi)
       (SAMPLE(?gdpVal) AS ?gdpPerCapita)
       (SAMPLE(?lifeVal) AS ?lifeExpectancy)
       (SAMPLE(?litVal) AS ?literacyRate)
       (GROUP_CONCAT(DISTINCT ?religionLabel; separator=", ") AS ?religions)
       (GROUP_CONCAT(DISTINCT ?ethnicLabel;  separator=", ") AS ?ethnicGroups)
       (SAMPLE(?govLabel) AS ?governmentType)
       (SAMPLE(?enTitle) AS ?enwikiTitle)
WHERE {
  ?item wdt:P298 "${cca3}".
  OPTIONAL { ?item wdt:P140 ?religion . ?religion rdfs:label ?religionLabel . FILTER(LANG(?religionLabel)="en") }
  OPTIONAL { ?item wdt:P172 ?ethnic .   ?ethnic   rdfs:label ?ethnicLabel .  FILTER(LANG(?ethnicLabel)="en") }
  OPTIONAL { ?item wdt:P122 ?gov .      ?gov      rdfs:label ?govLabel .     FILTER(LANG(?govLabel)="en") }

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

// Fetch images from Wikipedia REST API
async function fetchWikipediaImages(
  wikipediaTitle: string
): Promise<WikipediaImage[]> {
  try {
    const url = `https://api.wikimedia.org/core/v1/wikipedia/en/page/${encodeURIComponent(
      wikipediaTitle
    )}/links/media`;

    const response = await axios.get(url, {
      headers: {
        "User-Agent": "GaiaApp/1.0 (https://example.com/contact)",
        Accept: "application/json",
      },
      timeout: 8000,
    });

    const files = response.data?.files || [];

    const imageFiles = files.filter(
      (file: any) =>
        file.preferred?.mediatype === "BITMAP" ||
        file.preferred?.mediatype === "DRAWING"
    );

    return imageFiles;
  } catch (error) {
    console.warn(
      `Failed to fetch Wikipedia images for "${wikipediaTitle}":`,
      (error as Error).message
    );
    return []; // Return empty array if images fetch fails
  }
}

async function fetchWikiDataByCCA3(cca3: string): Promise<WikiDataFields> {
  const query = buildWikiDataQueryStringByCCA3(cca3);
  const url = "https://query.wikidata.org/sparql";
  const resp = await axios.get(url, {
    params: { query, format: "json" },
    headers: {
      "User-Agent": "GaiaApp/1.0 (https://example.com/contact)",
      Accept: "application/sparql-results+json",
    },
    timeout: 10000,
  });

  // If no results, return empty object
  const row = resp.data?.results?.bindings?.[0];
  if (!row) return {};

  // Helper to extract values
  const get = (k: string) => row[k]?.value as string | undefined;
  const parseNum = (k: string) => (get(k) ? Number(get(k)) : undefined);

  const enwikiTitle = get("enwikiTitle");

  // Fetch Wikipedia images if we have a title
  let images: WikipediaImage[] = [];
  if (enwikiTitle) {
    images = await fetchWikipediaImages(enwikiTitle);
  }

  return {
    religions: get("religions")?.split(", ").filter(Boolean),
    ethnicGroups: get("ethnicGroups")?.split(", ").filter(Boolean),
    governmentType: get("governmentType"),
    hdi: parseNum("hdi"),
    gdpPerCapita: parseNum("gdpPerCapita"),
    lifeExpectancy: parseNum("lifeExpectancy"),
    literacyRate: parseNum("literacyRate"),
    enwikiTitle,
    images,
  };
}

// Get REST Countries data by CCA3
async function fetchRestDataByCCA3(cca3: string): Promise<RestCountriesData> {
  const response = await axios.get<RestCountriesData[]>(
    `https://restcountries.com/v3.1/alpha/${cca3.toUpperCase()}`
  );

  if (response.data.length === 0) {
    throw new Error(`Country with code '${cca3.toUpperCase()}' not found`);
  }

  return response.data[0];
}

// Get WikiData for a country by CCA3 code
app.get("/api/countries/:code/wiki", async (req, res) => {
  const { code } = req.params;

  if (!code || code.trim().length !== 3) {
    return sendError(
      res,
      400,
      "INVALID_CODE",
      "Country code must be 3 letters"
    );
  }

  try {
    const wikiData = await fetchWikiDataByCCA3(code.toUpperCase());
    sendSuccess(res, wikiData);
  } catch (error) {
    console.error("WikiData error:", (error as Error).message);
    sendError(
      res,
      500,
      "API_ERROR",
      "WikiData service temporarily unavailable"
    );
  }
});

// Get combined country details (REST Countries + WikiData)
app.get(
  "/api/countries/:code/combined",
  async (req: Request, res: Response<ApiResponse<CountryDetails>>) => {
    const { code } = req.params;

    if (!code || code.trim().length !== 3) {
      return sendError(
        res,
        400,
        "INVALID_CODE",
        "Country code must be a 3-letter CCA3 code"
      );
    }

    try {
      // Fetch REST Countries data
      const restCountriesData = await fetchRestDataByCCA3(code);

      // Fetch WikiData (non-blocking, continue even if it fails)
      let wikiData: WikiDataFields | undefined;
      try {
        wikiData = await fetchWikiDataByCCA3(code);
      } catch (error) {
        console.warn(
          "WikiData fetch failed in combined endpoint:",
          (error as Error).message
        );
        // Continue without WikiData
      }

      // Combine the data
      const countryDetails: CountryDetails = {
        ...restCountriesData,
        wikiData,
      };

      sendSuccess(res, countryDetails);
    } catch (error) {
      console.error("Combined endpoint error:", (error as Error).message);

      const is404 = axios.isAxiosError(error) && error.response?.status === 404;
      sendError(
        res,
        is404 ? 404 : 500,
        is404 ? "NOT_FOUND" : "API_ERROR",
        is404
          ? `Country with code '${code.toUpperCase()}' not found`
          : "Failed to fetch combined country data"
      );
    }
  }
);

// Error handling middleware (Fallback)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled error:", err.stack);
  sendError(res, 500, "INTERNAL_ERROR", "An unexpected error occurred");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
