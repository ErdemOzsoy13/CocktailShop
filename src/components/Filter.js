import React, { useCallback, useEffect, useState } from "react";
import { useGlobalContext } from "../context";

const url = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=";

export default function Filter() {
  const { setFilterTerms, filterList } = useGlobalContext();
  const [loading, setLoading] = useState(true);
  const [cocktailList, setCocktailList] = useState([]);
  const [cocktailProperties, setCocktailProperties] = useState([]);

  // if (localStorage.cocktail_list) {
  //   const cocktail_list = JSON.parse(localStorage.getItem("cocktail_list"));
  //   setCocktailProperties(["info", "category", "glass"]);
  //   console.log("localstorage");
  //   setCocktailList(cocktail_list);
  //   setLoading(false);
  //   filterList("reset_filter");
  // }

  const fetchData = useCallback(async () => {
    try {
      const resp = await fetch(url);
      const data = await resp.json();
      const { drinks } = data;
      if (drinks) {
        const newDrinks = drinks.map((item) => {
          const {
            idDrink: id,
            strDrink: name,
            strDrinkThumb: image,
            strAlcoholic: info,
            strGlass: glass,
            strCategory: category,
          } = item;
          setCocktailProperties(["info", "category", "glass"]); // Hardcoding Properties
          return {
            id,
            name,
            image,
            info,
            glass,
            category,
          };
        });
        setCocktailList(newDrinks);
      } else {
        setCocktailList([]);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
    console.log("filter.js fetch and reset");
    filterList("reset_filter");
  }, []);

  const handleFilter = (filterTitle, term) => {
    const check = document.getElementById(`${term}`).checked;
    setFilterTerms(filterTitle, term, check);
  };

  useEffect(() => {
    if (!localStorage.cocktail_list) {
      fetchData();
    } else {
      const cocktail_list = JSON.parse(localStorage.getItem("cocktail_list"));
      setCocktailProperties(["info", "category", "glass"]);
      console.log("localstorage");
      setCocktailList(cocktail_list);
      setLoading(false);
      filterList("reset_filter");
      setLoading(false);
    }
  }, [fetchData]);

  if (loading) {
    return (
      <section className="section filter">
        <div className="filter-center">
          <h3 className="section-title">Filter</h3>
          <form className="filter-form">
            <article>
              <ul>
                <h4 className="filter-title">alcohol state</h4>
                <li className="loading"></li>
                <li className="loading"></li>
                <li className="loading"></li>
              </ul>
            </article>
            <article>
              <ul>
                <h4 className="filter-title">category</h4>
                <li className="loading"></li>
                <li className="loading"></li>
                <li className="loading"></li>
              </ul>
            </article>
            <article>
              <ul>
                <h4 className="filter-title">glass</h4>
                <li className="loading"></li>
                <li className="loading"></li>
                <li className="loading"></li>
              </ul>
            </article>
          </form>
        </div>
      </section>
    );
  }
  return (
    <section className="section filter">
      <div className="filter-center">
        <h3 className="section-title">Filter</h3>
        <form className="filter-form">
          {cocktailProperties.map((properties, index) => {
            return (
              <article key={index}>
                <ul>
                  <h4 className="filter-title">
                    {properties === "info" ? "Alcohol State" : properties}
                  </h4>
                  {[
                    ...new Set(cocktailList.map((item) => item[properties])),
                  ].map((item, index) => {
                    return (
                      <li key={index}>
                        <input
                          type="checkBox"
                          name={item}
                          id={item}
                          onClick={() => handleFilter(properties, item)}
                        />
                        <label htmlFor={item}>{item}</label>
                      </li>
                    );
                  })}
                </ul>
              </article>
            );
          })}
        </form>
      </div>
    </section>
  );
}
