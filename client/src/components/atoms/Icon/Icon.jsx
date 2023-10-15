import React from "react";
import PropTypes from "prop-types";

export default function Icon({ icon, className, onClick, alt }) {
  return <img className={className} src={icon} alt={alt} onClick={onClick} />;
}

Icon.propTypes = {
  onClick: PropTypes.func,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  icon: PropTypes.string.isRequired,
};
