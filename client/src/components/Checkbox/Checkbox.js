import React from "react";

export function Checkbox(props) {
  return (
    <div>
      <input
        type="checkbox"
        aria-label={props.value}
        name={props.name}
        value={props.value}
        onChange={props.onChange}
        onClick={props.onClick}
        checked={props.checked}
      />
      <label htmlFor="">{props.label}</label>
    </div>
  );
}
