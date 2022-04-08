import React from "react";
import useDarkMode from "../../hooks/useDarkMode";
import sunIcon from "../../assets/images/icons/white/sun.svg";
import moonIcon from "../../assets/images/icons/white/moon.svg";

export default function Theme() {
  const [colorTheme, setTheme] = useDarkMode();

  return (
    <div className="flex items-center">
      <span
        onClick={() => setTheme(colorTheme)}
        className="w-10 h-10 rounded-full bg-base dark:bg-white shadow-lg cursor-pointer flex items-center justify-center"
      >
        {colorTheme === "light" ? <img src={sunIcon} alt="Sun" /> : <img src={moonIcon} alt="Moon" />}
      </span>
    </div>
  );
}
