import React from "react";
import PropTypes from "prop-types";
import arrowIcon from "../../../assets/images/icons/white/angle-down-solid.svg";
import Button from "../../atoms/Button/Button";

export default function Dropdown({ text, options, open, setOpen }) {
  return (
    <div>
      <Button text={text} type="button" onClick={() => setOpen(!open)} img={arrowIcon} imgRight={true} />

      {open && (
        <div
          className="absolute z-10 divide-y divide-gray-100 rounded shadow w-44 bg-button text-text block origin-top-right top-14"
          data-popper-placement="bottom"
        >
          {options.map((option, i) => (
            <a
              key={i}
              className="block px-4 py-2 hover:bg-slate-700 hover:rounded dark:hover:text-white cursor-pointer"
              type="button"
              onClick={() => option.onClick()}
            >
              {option.text}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

Dropdown.propTypes = {
  text: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};
