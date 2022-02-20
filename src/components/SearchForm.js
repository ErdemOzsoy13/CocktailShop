import React, { useRef, useEffect } from "react";
import { useGlobalContext } from "../context";

export default function SearchForm() {
  const searchValue = useRef(null);
  const { setSearchTerm, closeSubmenu, filterTerms, setFilterTerms } =
    useGlobalContext();

  useEffect(() => {
    searchValue.current.focus();
    setSearchTerm("");
    setFilterTerms("reset_filter", []);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
  };
  console.count("hoooiiiii");
  const changeSearchTerm = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <section
      className="section search"
      onSubmit={handleSubmit}
      onMouseOver={closeSubmenu}
    >
      <form className="search-form">
        <div className="form-control">
          <label htmlFor="name">search your favorite cocktail</label>
          <input
            type="text"
            name="name"
            id="name"
            ref={searchValue}
            onChange={changeSearchTerm}
          />
          {filterTerms[0] && (
            <div className="filter-terms">
              {filterTerms.map((item, index) => {
                return (
                  <div key={index} className="term">
                    {item}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </form>
    </section>
  );
}
