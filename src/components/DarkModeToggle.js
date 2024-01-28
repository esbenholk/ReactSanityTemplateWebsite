import React, { useState, useEffect } from "react";

export const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState(true);
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
        <img
          alt="filter icon"
          src={process.env.PUBLIC_URL + "/assets/darkmodeicon.png"}
        ></img>
      ) : (
        <img
          alt="filter icon"
          src={process.env.PUBLIC_URL + "/assets/darkmodeicon.png"}
        ></img>
      )}
    </button>
  );
};
