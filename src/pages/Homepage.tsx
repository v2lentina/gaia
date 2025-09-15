// HomePage.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [countries, setCountries] = useState([]); //all countries - static data source after fetching
  const [filteredCountries, setFilteredCountries] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get(
          "https://restcountries.com/v3.1/all?fields=name,flags"
        );
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
          filteredCountries.map((country: any, index: number) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
                fontSize: "18px",
              }}
            >
              <img
                src={country.flags.svg}
                alt={`${country.name.common} Flag`}
                style={{ width: "30px", marginRight: "10px" }}
              />
              <span>{country.name.common}</span>
            </div>
          ))
        ) : (
          <p>No country found.</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
