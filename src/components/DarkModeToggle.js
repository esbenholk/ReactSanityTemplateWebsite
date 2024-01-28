import React, { useState, useEffect, useContext } from "react";
import AppContext from "../globalState";
import { MenuImage } from "./menuItem";

export const DarkModeToggle = () => {
  const myContext = useContext(AppContext);
  const info = myContext.siteSettings;
  const [isDark, setIsDark] = useState();
  console.log("darkmode info", info);
  useEffect(() => {
    if (isDark) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <button
      className="header-padding"
      onClick={(e) => {
        console.log("is  dark");
        e.stopPropagation();
        setIsDark(!isDark);
      }}
    >
      {isDark ? (
        <MenuImage width={80} image={info.darkmodebutton} />
      ) : (
        <MenuImage width={80} image={info.lightmodebutton} />
      )}
    </button>
  );
};
