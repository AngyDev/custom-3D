import React, { useState } from "react";
import Button from "../Button/Button";
import PropTypes from "prop-types";

export default function ChangeColor({ onClick, onClose }) {
  const [color, setColor] = useState();

  const saveColor = () => {
    onClick(color);
  };

  return (
    <>
      <div className="modal__body flex color__container text-black">
        <div className="flex flex-col items-center color">
          <input type="button" className="color__box color__yellow color__btn" onClick={(e) => setColor(e.target.name)} name="#fcba03" />
          <span>Tumore</span>
        </div>
        <div className="flex flex-col items-center color">
          <input type="button" className="color__box color__blue color__btn" onClick={(e) => setColor(e.target.name)} name="blue" />
          <span>Osso</span>
        </div>
      </div>
      <div className="modal__footer modal__border-t">
        <Button type="button" typeClass="modal__btn-confirm" text="Confirm" onClick={saveColor} />
        <Button type="button" typeClass="modal__btn-cancel" text="Cancel" onClick={onClose} />
      </div>
    </>
  );
}

ChangeColor.propTypes = {
  onClick: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
