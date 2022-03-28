import React from "react";
import PropTypes from "prop-types";

export default function Button({ typeClass, type, onClick, title, disabled, text, img }) {
  return (
    <button className={`btn ${typeClass}`} type={type} onClick={onClick} title={title} disabled={disabled}>
      {text}
      {img && <img className="btn__img" src={img} alt={title} />}
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
