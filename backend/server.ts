const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

import { Request, Response, NextFunction } from "express"; // Import types

const app = express();
const PORT: number = parseInt(process.env.PORT || "5000");

// Middleware
app.use(cors());
app.use(express.json());

// Types for API responses
interface Country {
  name: {
    common: string; // English
    official: string;
  };
  flags: {
    svg: string;
    png: string;
  };
  translations?: {
    [key: string]: {
      common: string;
      official: string;
    };
  };
}

interface CountryDetails extends Country {
  region: string;
  subregion: string;
  population: number;
  capital: string[];
  languages: {
    [key: string]: string;
  };
}

// Routes
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Gaia Backend API is running!" });
});

// Get countries by extract
app.get("/api/search", async (req: Request, res: Response) => {
  const { q } = req.query; // Extract query from URL

  if (!q || typeof q !== "string" || q.trim() === "") {
    console.log("Invalid search query received:", q);
    return res.json([]); // Empty results for empty queries
  }

  try {
    // REST Countries API Search
    const response = await axios.get(
      `https://restcountries.com/v3.1/name/${q}?fields=name,flags,translations`
    );
    res.json(response.data);
  } catch (error) {
    res.json([]);
  }
});

// Get country by name
app.get("/api/countries/:name", async (req: Request, res: Response) => {
  const { name } = req.params;

  try {
    const response = await axios.get(
      `https://restcountries.com/v3.1/name/${name}?fullText=true&fields=name,flags,region,subregion,population,capital,languages`
    );
    res.json(response.data[0]);
  } catch (error) {
    console.error("Error fetching country details:", (error as Error).message);
    res.status(500).json({ error: "Failed to fetch country details" });
  }
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
