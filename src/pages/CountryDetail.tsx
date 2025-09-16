import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const CountryDetail: React.FC = () => {
  //declares functional component
  const { name } = useParams<{ name: string }>(); //extracting name parameter from URL
  const [country, setCountry] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        const response = await axios.get(
          `https://restcountries.com/v3.1/name/${name}?fullText=true`
        );
        setCountry(response.data[0]);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching country details:", err);
        setError(true);
        setLoading(false);
      }
    };

    fetchCountry();
  }, [name]); //dependency array assures the effect only runs when 'name' parameter changes

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Could not fetch country details.</p>;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>{country.name.common}</h1>
      <img
        src={country.flags.svg}
        alt={`${country.name.common} flag`}
        style={{ width: "200px", borderRadius: "8px" }}
      />
      <p>
        <strong>Region:</strong> {country.region}
      </p>
      <p>
        <strong>Subregion:</strong> {country.subregion}
      </p>
      <p>
        <strong>Population:</strong> {country.population.toLocaleString()}
      </p>
      <p>
        <strong>Capital:</strong> {country.capital?.[0]}
      </p>
      <p>
        <strong>Languages:</strong>{" "}
        {Object.values(country.languages || {}).join(", ")}
      </p>
    </div>
  );
};

export default CountryDetail;
