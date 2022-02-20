import React from "react";
import Cocktail from "./Cocktail";
import { useGlobalContext } from "../context";
import Loading from "./Loading";

export default function CocktailList() {
  const { loading, cocktailList } = useGlobalContext();

  if (loading) {
    return <Loading />;
  }

  if (cocktailList.length < 1) {
    return (
      <section className="section">
        <h2 className="section-title">
          no cocktails matched your search criteria
        </h2>
      </section>
    );
  }

  return (
    <section className="section cocktail_list">
      <h2 className="section-title">cocktails</h2>
      <div className="cocktails-center">
        {cocktailList.map((cocktail) => {
          return <Cocktail key={cocktail.id} {...cocktail} />;
        })}
      </div>
    </section>
  );
}
