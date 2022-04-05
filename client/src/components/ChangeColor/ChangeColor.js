import React, { useState } from "react";
import Button from "../Button/Button";
import PropTypes from "prop-types";

export default function ChangeColor({ onClick }) {
  const [color, setColor] = useState();

  const saveColor = () => {
    onClick(color);
  };

  return (
    <>
      <div className="flex container">
        <div className="flex flex-col align-center color">
          <input type="button" className="color__box color__yellow color__btn" onClick={(e) => setColor(e.target.name)} name="#fcba03" />
          <span>Tumore</span>
        </div>
        <div className="flex flex-col align-center color">
          <input type="button" className="color__box color__blue color__btn" onClick={(e) => setColor(e.target.name)} name="blue" />
          <span>Osso</span>
        </div>
      </div>
      <Button typeClass="btn--size" text="Save" onClick={saveColor} />
    </>
  );
}

ChangeColor.propTypes = {
  onClick: PropTypes.func.isRequired,
};
