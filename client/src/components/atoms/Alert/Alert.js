import React from "react";
import PropTypes from "prop-types";
import xIcon from "../../../assets/images/icons/black/close-modal.svg";
import Button from "../../atoms/Button/Button";

export default function Alert({ open, onClose, text }) {
  if (!open) return null;

  return (
    <>
      <div id="popup-modal" tabIndex="-1" className="modal__container">
        <div className="modal__container-main max-w-md">
          <div className="modal__content">
            <div className="modal__header-delete">
              <button type="button" className="modal__x-btn" data-modal-toggle="popup-modal" onClick={onClose}>
                <img className="w-4 h-4" src={xIcon} alt="close" />
              </button>
            </div>
            <div className="p-6 pt-0 text-center">
              <svg
                className="mx-auto mb-4 w-14 h-14 text-gray-400 dark:text-gray-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">{text}</h3>
              <div className="flex justify-center">
                <Button type="button" typeClass="modal__btn-delete-yes" onClick={onClose} text="Ok" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

Alert.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
};
