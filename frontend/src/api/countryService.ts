import axios from "axios";
import type { Country, CountryDetails, SummaryResponse } from "../types/api";
import { ApiError } from "../types/api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// central error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status ?? 500;
    const message = error.response?.data?.message ?? "Request failed";
    return Promise.reject(new ApiError(message, status));
  }
);

/**
 * Search countries by name
 * Calls: GET /api/countries/search?q=<searchTerm>
 */
export const searchCountriesByName = async (
  searchTerm: string
): Promise<Country[]> => {
  if (!searchTerm.trim()) return [];

  const response = await api.get<Country[]>("/api/countries/search", {
    params: { q: searchTerm.trim() },
  });
  return response.data;
};

/**
 * Get detailed country information by CCA3 code
 * Calls: GET /api/countries/:code
 */
export const getCountryByCode = async (
  code: string
): Promise<CountryDetails> => {
  if (!code.trim()) throw new Error("Invalid country code");

  const cca3 = code.toUpperCase();
  const response = await api.get<CountryDetails>(`/api/countries/${cca3}`, {
    timeout: 30000,
  });
  return response.data;
};

/**
 * Get AI-generated summary for a country
 * Calls: POST /api/summary
 * Body: { country: string }
 */
export const getCountrySummary = async (
  countryName: string
): Promise<SummaryResponse> => {
  if (!countryName.trim()) throw new Error("Invalid country name");

  const response = await api.post<SummaryResponse>(
    "/api/summary",
    { country: countryName.trim() },
    {
      timeout: 60000,
    }
  );
  return response.data;
};
