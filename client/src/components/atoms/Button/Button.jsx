import React from "react";
import PropTypes from "prop-types";

export default function Button({ typeClass, type, onClick, title, disabled, text, img, active, imgRight }) {
  return (
    <button
      className={`btn ${typeClass} ${disabled ? "bg-gray-500 cursor-not-allowed disabled:bg-gray-500" : ""} ${active ? "bg-yellow-600" : ""}`}
      type={type}
      onClick={onClick}
      title={title}
      disabled={disabled}
    >
      {img && !imgRight && <img className="w-4 h-4" src={img} alt={title} />}
      {text && <span className="pl-2 pr-2">{text}</span>}
      {imgRight && <img className="w-4 h-4" src={img} alt={title} />}
    </button>
  );
}

Button.propTypes = {
  typeClass: PropTypes.string,
  type: PropTypes.string,
  onClick: PropTypes.func,
  title: PropTypes.string,
  disabled: PropTypes.bool,
  active: PropTypes.bool,
  text: PropTypes.string,
  img: PropTypes.string,
  imgRight: PropTypes.bool,
};
