import React from "react";
import PropTypes from "prop-types";

export function Checkbox(props) {
  return (
    <div className="flex items-center mb-1">
      <div className="flex items-center h-5">
        <input
          type="checkbox"
          className="form__checkbox"
          aria-label={props.value}
          name={props.name}
          value={props.value}
          onChange={props.onChange}
          onClick={props.onClick}
          checked={props.checked}
        />
      </div>
      <div className="ml-3 text-lg">
        <label className={`form__checkbox-label ${props.className}`} htmlFor="">
          {props.label}
        </label>
      </div>
    </div>
  );
}

Checkbox.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  checked: PropTypes.bool,
  className: PropTypes.string,
};
