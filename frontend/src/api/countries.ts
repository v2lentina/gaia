// countries.ts includes all api calls related to countries (regardless from which api they come)
import axios from "axios";
import type { Country, ApiResponse } from "../types/api";

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

  const response = await axios.get<ApiResponse<Country[]>>(
    `http://localhost:5000/api/search?q=${encodeURIComponent(searchTerm)}`
  );

  console.log("Frontend Country API data received:", response.data);

  if (response.data.success) {
    return response.data.data;
  } else {
    // Let calling code handle the error
    throw new Error("Search failed");
  }
};
