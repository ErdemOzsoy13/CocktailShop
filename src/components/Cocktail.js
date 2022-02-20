import React from "react";
import { Link } from "react-router-dom";
import { useGlobalContext } from "../context";

export default function Cocktail(cocktail) {
  const { id, name, image, info, glass } = cocktail;
  const { handleChange } = useGlobalContext();
  return (
    <article className="cocktail">
      <div className="img-container">
        <img src={image} alt={name} />
      </div>
      <div className="cocktail-footer">
        <h3>{name}</h3>
        <h4>{glass}</h4>
        <p>{info}</p>
        <Link to={`/cocktails/${id}`} className="btn btn-primary btn-details">
          details
        </Link>
        <button
          className="btn btn-primary btn-details"
          onClick={() => handleChange(id, "add", cocktail)}
        >
          add to cart
        </button>
      </div>
    </article>
  );
}
