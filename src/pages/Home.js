import React from "react";
import { FaBars } from "react-icons/fa";
import CocktailList from "../components/CocktailList";
import Filter from "../components/Filter";
import SearchForm from "../components/SearchForm";

export default function Home() {
  return (
    <div className="home-container">
      <div className="flex-container">
        <button className="toggle-btn">
          <FaBars />
        </button>
        <Filter />
        <div className="main-section">
          <SearchForm />
          <CocktailList />
        </div>
      </div>
    </div>
  );
}
