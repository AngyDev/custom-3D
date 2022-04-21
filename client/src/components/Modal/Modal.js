import React from "react";
import PropTypes from "prop-types";
import xIcon from "../../assets/images/icons/black/close-modal.svg";

export default function Modal({ open, onClose, children, title }) {
  if (!open) return null;

  return (
    <>
      {/* <!-- Main modal --> */}
      <div aria-hidden="true" className="modal__container">
        <div className="modal__container-main max-w-2xl">
          {/* <!-- Modal content --> */}
          <div className="modal__content">
            {/* <!-- Modal header --> */}
            <div className="modal__header modal__border-b">
              <h3 className="modal__title">{title}</h3>
              <button type="button" className="modal__x-btn" data-modal-toggle="defaultModal" onClick={onClose}>
                <img className="w-4 h-4" src={xIcon} alt="close" />
              </button>
            </div>
            {/* <!-- Modal body --> */}
            {children}
            {/* <!-- Modal footer --> */}
            {/* <div className="modal__footer modal__border-t">
              <Button type="button" typeClass="modal__btn-confirm" text="Confirm" onClick={onClick} />
              <Button type="button" typeClass="modal__btn-cancel" text="Cancel" onClick={onClose} />
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
}

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  text: PropTypes.string.isRequired,
};
