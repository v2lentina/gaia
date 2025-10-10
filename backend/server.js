const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Gaia Backend API is running!" });
});

// Get all countries
app.get("/api/countries", async (req, res) => {
  try {
    const response = await axios.get(
      "https://restcountries.com/v3.1/all?fields=name,flags"
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching countries:", error.message);
    res.status(500).json({ error: "Failed to fetch countries" });
  }
});

// Get country by name
app.get("/api/countries/:name", async (req, res) => {
  const { name } = req.params;

  try {
    const response = await axios.get(
      `https://restcountries.com/v3.1/name/${name}?fullText=true&fields=name,flags,region,subregion,population,capital,languages`
    );
    res.json(response.data[0]);
  } catch (error) {
    console.error("Error fetching country details:", error.message);
    res.status(500).json({ error: "Failed to fetch country details" });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
