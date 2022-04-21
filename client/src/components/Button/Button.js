import React from "react";
import PropTypes from "prop-types";

export default function Button({ typeClass, type, onClick, title, disabled, text, img }) {
  return (
    <button className={`btn ${typeClass} ${disabled ? "bg-red-500" : ""}`} type={type} onClick={onClick} title={title} disabled={disabled}>
      {img && <img className="w-4 h-4" src={img} alt={title} />}
      {text && <span className="pl-2 pr-2">{text}</span>}
    </button>
  );
}

Button.propTypes = {
  typeClass: PropTypes.string,
  type: PropTypes.string,
  onClick: PropTypes.func,
  title: PropTypes.string,
  disabled: PropTypes.bool,
  text: PropTypes.string,
  img: PropTypes.string,
};
