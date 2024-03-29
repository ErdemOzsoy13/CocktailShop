import React, { useState, useEffect, useRef } from "react";
import { useGlobalContext } from "../context";

export default function Submenu() {
  const {
    isSubmenuOpen,
    submenuInfo: { page, location },
  } = useGlobalContext();
  const { pageName, links } = page;
  const { center, bottom } = location;
  const [columns, setColumns] = useState("col-2");
  const submenuRef = useRef(null);

  useEffect(() => {
    setColumns("col-2");
    switch (true) {
      case links.length === 3:
        setColumns("col-3");
        break;
      case links.length >= 4:
        setColumns("col-4");
        break;
      default:
        break;
    }
    const container = submenuRef.current;
    container.style.top = bottom + "px";
    container.style.left = center + "px";
  }, [bottom, center, links]);

  return (
    <aside
      ref={submenuRef}
      className={`${isSubmenuOpen ? "submenu show" : "submenu"}`}
    >
      <section>
        <h4>{pageName}</h4>
        <div className={`submenu-center ${columns}`}>
          {links.map((link, index) => {
            const { url, icon, label } = link;
            return (
              <a key={index} href={url}>
                {icon}
                {label}
              </a>
            );
          })}
        </div>
      </section>
    </aside>
  );
}
