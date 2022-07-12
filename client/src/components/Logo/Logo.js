import PropTypes from "prop-types";
import React from "react";
import logoScuro from "../../assets/images/logo_sfondo_scuro.svg";
import logoChiaro from "../../assets/images/logo_sfondo_chiaro.svg";

export default function Logo({ className, theme }) {
  return (
    <>
      {theme === "dark" || theme === null ? (
        <img className={`${className}`} src={logoScuro} alt="logo" />
      ) : (
        <img className={`${className}`} src={logoChiaro} alt="logo" />
      )}
    </>
  );
}

Logo.propTypes = {
  className: PropTypes.string,
  theme: PropTypes.string,
};
