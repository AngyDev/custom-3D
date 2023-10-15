import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

export const ThemeContext = React.createContext({});

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(localStorage.theme ? localStorage.theme : "dark");
  const colorTheme = theme === "dark" ? "light" : "dark";

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove(colorTheme);
    root.classList.add(theme);
  }, [theme]);

  return <ThemeContext.Provider value={[theme, setTheme]}>{children}</ThemeContext.Provider>;
}

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
