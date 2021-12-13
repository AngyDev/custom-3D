import React from 'react';
import Button from '../Button/Button';
import saveIcon from '../../assets/images/icons/save-solid.svg';
import { useSelector } from 'react-redux';
import { getScene } from '../../features/scene/sceneSlice';
import { saveProjectScene } from '../../utils/api';

export default function Save() {

    const scene = useSelector(getScene);

    const saveScene = () => {
        console.log(scene);
        const json = scene.toJSON();
        const output = JSON.stringify(json);
        saveProjectScene("b6e67444-1450-4f15-84d6-74ed7f67a1f4", output);
        console.log("saved");
    }

    return (
        <Button typeClass="btn--img" img={saveIcon} onClick={saveScene} title="Save" />
    )
}
