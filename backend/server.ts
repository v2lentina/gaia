import express, { Request, Response, NextFunction } from "express"; // Import express types
import cors from "cors";
import axios from "axios";
import { Country, ApiError, ApiResponse } from "./types/api"; // Import api types

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

// Get countries by extract
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
        const officialName = country.name?.official?.toLowerCase() || "";

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

/* Get country details by name
app.get(
  "/api/countries/:name",
  async (req: Request, res: Response<ApiResponse<CountryDetails>>) => {
    const { name } = req.params;

    try {
      const response = await axios.get(
        `https://restcountries.com/v3.1/name/${name}?fullText=true&fields=name,flags,region,subregion,population,capital,languages`
      );

      sendSuccess(res, response.data[0]);
    } catch (error) {
      console.error(
        "Error fetching country details:",
        (error as Error).message
      );

      const is404 = axios.isAxiosError(error) && error.response?.status === 404;
      sendError(
        res,
        is404 ? 404 : 500,
        is404 ? "NOT_FOUND" : "API_ERROR",
        is404 ? "No results found" : "Service temporarily unavailable"
      );
    }
  }
);*/

// Error handling middleware (Fallback)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled error:", err.stack);
  sendError(res, 500, "INTERNAL_ERROR", "An unexpected error occurred");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
