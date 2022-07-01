import PropTypes from "prop-types";
import React from "react";
import xIcon from "../../assets/images/icons/black/close-modal.svg";
import "./badge.css";

export const Badge = ({ text, handleClick, className }) => {
  return (
    <>
      <button type="button" className={`btn-badge ${className}`} onClick={handleClick}>
        <span className="badge-text">{text}</span> <img className="w-4 h-4" src={xIcon} alt="close" />
      </button>
    </>
  );
};

Badge.propTypes = {
  text: PropTypes.string,
  handleClick: PropTypes.func,
  className: PropTypes.string,
};
