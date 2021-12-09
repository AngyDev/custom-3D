import React from 'react';
import Button from '../Button/Button';

export default function Modal({ open, children, onClose, title, onClick, text }) {

    if (!open) return null;

    return (
        <div className="modal__overlay">
            <div className="modal flex flex-col">
                <div className="modal__header">
                    <span className="modal__title">{title}</span>
                    <div className="modal__close" onClick={onClose}>&times;</div>
                </div>
                <div className="modal__body">
                    {children}
                </div>
                {/* <div className="modal__footer flex justify-end">
                    <Button typeClass="btn--size modal__btn" onClick={onClose} text="Close" />
                    <Button typeClass="btn--size" onClick={onClick} text={text} />
                </div> */}
            </div>
        </div>
    )
}
