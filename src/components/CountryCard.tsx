import React from "react";
import { Link } from "react-router-dom";

interface CountryCardProps {
  name: string;
  flag: string;
}

const CountryCard: React.FC<CountryCardProps> = ({ name, flag }) => {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "1rem",
        textAlign: "center",
        width: "150px",
      }}
    >
      <Link
        to={`/country/${name}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        {" "}
        <img
          src={flag}
          alt={`${name} flag`}
          style={{ width: "100%", borderRadius: "4px" }}
        />
        <h3 style={{ fontSize: "1rem", marginTop: "0.5rem" }}>{name}</h3>
      </Link>{" "}
    </div>
  );
};

export default CountryCard;
