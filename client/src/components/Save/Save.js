import React, { useContext } from 'react';
import Button from '../Button/Button';
import saveIcon from '../../assets/images/icons/save-solid.svg';
import { useSelector } from 'react-redux';
import { getScene, getChildren } from '../../features/scene/sceneSlice';
import { saveObject } from '../../utils/api';

export default function Save({ projectId }) {
	const scene = useSelector(getScene);
	const children = useSelector(getChildren);

	const saveScene = async () => {
		const group = children.filter((item) => item.type === 'Group');

		const json = group[0].toJSON();
		const output = JSON.stringify(json);

		console.log(output);

		const response = await saveObject(group[0].uuid, projectId, output);
		if (response) {
			console.log('saved');
		}
	};

	return <Button typeClass="btn--img" img={saveIcon} onClick={saveScene} title="Save" />;
}
