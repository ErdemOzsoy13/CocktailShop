import React from "react";
import { Link } from "react-router-dom";
import { useGlobalContext } from "../context";
import logo from "../logo.svg";

export default function Navbar() {
  const { openSubmenu, closeSubmenu, cartAmount } = useGlobalContext();

  const displaySubmenu = (e) => {
    const page = e.target.textContent;
    const tempBtn = e.target.getBoundingClientRect();
    const center = (tempBtn.left + tempBtn.right) / 2;
    const bottom = tempBtn.bottom;
    openSubmenu(page, { center, bottom });
  };

  const handleSubmenu = (e) => {
    if (!e.target.classList.contains("link-btn")) {
      closeSubmenu();
    }
  };

  return (
    <nav className="navbar" onMouseOver={handleSubmenu}>
      <div className="nav-center">
        <div to="/">
          <img src={logo} alt="cocktail db logo" className="logo" />
        </div>
        <ul className="nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <a className="link-btn" onMouseOver={displaySubmenu}>
              products
            </a>
          </li>
          <li>
            <a className="link-btn" onMouseOver={displaySubmenu}>
              company
            </a>
          </li>
          <li>
            <Link to="/mostpopularcocktails">most popular cocktails</Link>
          </li>
          <li>
            <Link to="/cartpage" className="nav-cart-container">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M16 6v2h2l2 12H0L2 8h2V6a6 6 0 1 1 12 0zm-2 0a4 4 0 1 0-8 0v2h8V6zM4 10v2h2v-2H4zm10 0v2h2v-2h-2z" />
              </svg>
              <div className="amount-container">
                <p className="total-amount">{cartAmount}</p>
              </div>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
