import React from "react";
import PropTypes from "prop-types";
import { ThemeProvider } from "./ThemeContext";
import { AuthContextProvider } from "./AuthContext";

export function AppWrapper({ children }) {
  return (
    <ThemeProvider>
      <AuthContextProvider>{children}</AuthContextProvider>
    </ThemeProvider>
  );
}

AppWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};
