import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Loading from "../components/Loading";
import { useGlobalContext } from "../context";

const url = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=";

export default function SingleCocktail() {
  const { closeSubmenu, handleChange } = useGlobalContext();
  const [loading, setLoading] = useState(true);
  const [cocktail, setCocktail] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await fetch(`${url}${id}`);
        const data = await response.json();
        if (data.drinks) {
          const {
            strDrink: name,
            strDrinkThumb: image,
            strAlcoholic: info,
            strCategory: category,
            strGlass: glass,
            strInstructions: instructions,
            strIngredient1,
            strIngredient2,
            strIngredient3,
            strIngredient4,
            strIngredient5,
          } = data.drinks[0];
          const ingredients = [
            strIngredient1,
            strIngredient2,
            strIngredient3,
            strIngredient4,
            strIngredient5,
          ];
          const newCoctail = {
            name,
            image,
            info,
            category,
            glass,
            instructions,
            ingredients,
          };
          setCocktail(newCoctail);
        } else {
          setCocktail(null);
        }
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  if (!cocktail) {
    return <h2 className="section-title">no cocktail to display</h2>;
  }

  const { name, image, info, category, glass, instructions, ingredients } =
    cocktail;

  return (
    <section className="section cocktail-section" onMouseOver={closeSubmenu}>
      <Link to="/" className="btn btn-primary">
        back home
      </Link>

      <h2 className="section-title">{name}</h2>
      <div className="drink">
        <img src={image} alt={name} />
        <div className="drink-info">
          <p>
            <span className="drink-data">name : </span>
            {name}
          </p>
          <p>
            <span className="drink-data">category : </span>
            {category}
          </p>
          <p>
            <span className="drink-data">info : </span>
            {info}
          </p>
          <p>
            <span className="drink-data">glass : </span>
            {glass}
          </p>
          <p>
            <span className="drink-data">instructions : </span>
            {instructions}
          </p>
          <p>
            <span className="drink-data">ingredients : </span>
            {ingredients.map((item, index) => {
              return item ? <span key={index}>{item}</span> : null;
            })}
          </p>
          <button
            className="btn add-to-cart"
            onClick={() => handleChange(id, "add", cocktail)}
          >
            add to cart
          </button>
        </div>
      </div>
    </section>
  );
}
