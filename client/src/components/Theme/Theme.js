import React, { useContext } from "react";
import sunIcon from "../../assets/images/icons/white/sun.svg";
import moonIcon from "../../assets/images/icons/white/moon.svg";
import { ThemeContext } from "../../context/ThemeContext";

export default function Theme() {
  const [theme, setTheme] = useContext(ThemeContext);

  const changeTheme = (e) => {
    localStorage.setItem("theme", e.target.alt);

    setTheme(e.target.alt);
  };

  return (
    <div className="flex items-center">
      <button className="border-none hover:bg-slate-700 w-10 h-10 rounded-full bg-button shadow-lg cursor-pointer flex items-center justify-center">
        {theme === "dark" ? (
          <img src={sunIcon} alt="light" value="light" onClick={changeTheme} />
        ) : (
          <img src={moonIcon} alt="dark" value="dark" onClick={changeTheme} />
        )}
      </button>
    </div>
  );
}
