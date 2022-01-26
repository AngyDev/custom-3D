import React, { useState } from "react";
import Button from "../Button/Button";

export default function ChangeColor({ onClick }) {
  const [color, setColor] = useState();

  const saveColor = () => {
    onClick(color);
  };

  return (
    <>
      <div className="flex container">
        <div className="flex flex-col align-center color">
          <input type="button" className="color__box color__red color__btn" onClick={(e) => setColor(e.target.name)} name="red" />
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
