import React, { useState } from 'react';
import downloadIcon from '../../assets/images/icons/download-solid.svg';
import Button from '../Button/Button';
import Modal from '../Modal/Modal';

export default function Export() {

    const [isOpen, setIsOpen] = useState(false);

    const exportObjects = () => {
        setIsOpen(true);
    }

    return (
        <>
            <Button typeClass="btn--img" img={downloadIcon} onClick={exportObjects} title="Export"/>
            <Modal open={isOpen} onClose={() => setIsOpen(false)} title="Export Objects" text="Export">
                Hello
            </Modal>
        </>
    )
}
