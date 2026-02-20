import axios from "axios";
import type { Country, CountryDetails } from "../types/api";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

/**
 * Search countries by name
 * Calls: GET /api/countries/search?q=<searchTerm>
 */
export const searchCountriesByName = async (
  searchTerm: string
): Promise<Country[]> => {
  if (!searchTerm.trim()) return [];

  const { data } = await axios.get<Country[]>(
    `${API_BASE_URL}/api/countries/search`,
    {
      params: { q: searchTerm.trim() },
      timeout: 10000,
    }
  );
  return data;
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

  const { data } = await axios.get<CountryDetails>(
    `${API_BASE_URL}/api/countries/${cca3}`,
    {
      timeout: 30000,
    }
  );
  return data;
};
