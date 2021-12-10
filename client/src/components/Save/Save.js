import React from 'react';
import Button from '../Button/Button';
import saveIcon from '../../assets/images/icons/save-solid.svg';

export default function Save() {

    const saveScene = () => {
        console.log("save");
    }

    return (
        <Button typeClass="btn--img" img={saveIcon} onClick={saveScene} title="Save"/>
    )
}
