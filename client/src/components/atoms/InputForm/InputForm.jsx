import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

export default function InputForm({ label, id, type, classNameLabel, classNameInput, register, required }) {
  return (
    <>
      <label htmlFor={id} className={classNames(classNameLabel)}>
        {label}
      </label>
      <input type={type} id={id} className={classNames(classNameInput)} {...register(id, { required })} />
    </>
  );
}

InputForm.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string,
  type: PropTypes.string,
  classNameLabel: PropTypes.string,
  classNameInput: PropTypes.string,
  register: PropTypes.func,
  required: PropTypes.string,
};
