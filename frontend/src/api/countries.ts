// countries.ts includes all api calls related to countries (regardless from which api they come)
import axios from "axios";
import type {
  Country,
  ApiResponse,
  RestCountriesData,
  WikiDataFields,
  CountryDetails,
} from "../types/api";

// Centralized API instance for backend
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Generic response handler for our backend API responses
 * @param response - Axios response with ApiResponse wrapper
 * @returns The unwrapped data or throws error
 */
function handleApiResponse<T>(response: { data: ApiResponse<T> }): T {
  console.log("API response received:", response.data);

  if (response.data.success) {
    return response.data.data;
  } else {
    throw new Error(response.data.error?.message || "API request failed");
  }
}

/**
 * Search for countries by name
 * @param searchTerm - Search term (e.g., "germany", "ger")
 * @returns Promise<Country[]> - Array of matching countries
 */
export const searchCountries = async (
  searchTerm: string
): Promise<Country[]> => {
  if (!searchTerm.trim()) {
    return [];
  }

  const response = await api.get<ApiResponse<Country[]>>(
    `/search?q=${encodeURIComponent(searchTerm)}`
  );

  return handleApiResponse(response);
};

/**
 * Get REST Countries data by country code
 * @param code - 3-letter country code (e.g., "DEU", "USA")
 * @returns Promise<RestCountriesData> - Country details from REST Countries API
 */
export const getRestCountriesData = async (
  code: string
): Promise<RestCountriesData> => {
  if (!code.trim()) {
    throw new Error("Invalid country code");
  }

  const response = await api.get<RestCountriesData[]>(
    `/countries/${encodeURIComponent(code)}/rest`
  );

  if (response.data.length === 0) {
    throw new Error("Country not found in REST Countries API");
  }

  return response.data[0];
};

/**
 * Get WikiData for a country
 * @param code - 3-letter country code (e.g., "DEU", "USA")
 * @returns Promise<WikiDataFields> - Country details from WikiData API
 */
export const getWikiData = async (code: string): Promise<WikiDataFields> => {
  if (!code.trim()) {
    throw new Error("Invalid country code");
  }

  const response = await api.get<ApiResponse<WikiDataFields>>(
    `/countries/${encodeURIComponent(code)}/wiki`
  );

  return handleApiResponse(response);
};

/**
 * Get basic country details
 * @param code - 3-letter country code (e.g., "DEU", "USA")
 * @returns Promise<RestCountriesData> - Basic country info
 */
export const getBasicCountryData = async (
  code: string
): Promise<RestCountriesData> => {
  if (!code.trim()) {
    throw new Error("Invalid country code");
  }

  const response = await api.get<ApiResponse<RestCountriesData>>(
    `/countries/${encodeURIComponent(code)}/rest`
  );

  return handleApiResponse(response);
};

/**
 * Get WikiData for a country
 * @param code - 3-letter country code (e.g., "DEU", "USA")
 * @returns Promise<WikiDataFields> - WikiData information
 */
export const getWikiDataByCode = async (
  code: string
): Promise<WikiDataFields> => {
  if (!code.trim()) {
    throw new Error("Invalid country code");
  }

  const response = await api.get<ApiResponse<WikiDataFields>>(
    `/countries/${encodeURIComponent(code)}/wiki`
  );

  return handleApiResponse(response);
};

/**
 * Get complete country details (combined data)
 * @param code - 3-letter country code (e.g., "DEU", "USA")
 * @returns Promise<CountryDetails> - Complete country details
 */
export const getCountryByCode = async (
  code: string
): Promise<CountryDetails> => {
  if (!code.trim()) {
    throw new Error("Invalid country code");
  }

  const response = await api.get<ApiResponse<CountryDetails>>(
    `/countries/${encodeURIComponent(code)}/combined`
  );

  return handleApiResponse(response);
};
