// HomePage.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import CountryCard from "../components/CountryCard";

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [countries, setCountries] = useState([]); //all countries - static data source after fetching
  const [filteredCountries, setFilteredCountries] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/countries");
        setCountries(response.data);
        setFilteredCountries(response.data); //show all countries initially
      } catch (error) {
        console.error("Fehler beim Abrufen der Länder:", error);
      }
    };

    fetchCountries();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    //event comes from an html input element
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    //filter countries based on search term
    const results = countries.filter((country: any) =>
      country.name.common.toLowerCase().includes(term)
    );
    setFilteredCountries(results);
  };

  //TXS
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Welcome to Flag-Shop</h1>
      <p>Search for a Country:</p>

      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearch}
        style={{
          padding: "10px",
          width: "300px",
          fontSize: "16px",
          marginBottom: "20px",
        }}
      />

      <div>
        {filteredCountries.length > 0 ? (
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {" "}
            {filteredCountries.map((country: any) => (
              <CountryCard
                key={country.name.common}
                name={country.name.common}
                flag={country.flags.svg} // HIGHLIGHT: Übergabe von Props
              />
            ))}
          </div>
        ) : (
          <p>No country found.</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
