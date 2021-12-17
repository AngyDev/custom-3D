import React, { useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { getIsCommentsActive } from '../../features/comments/commentsSlice';
import { getSceneModified, getScene, setScene, setSceneModified, setCanvas } from '../../features/scene/sceneSlice';

export default function Main({ project }) {
	const isCommentsActive = useSelector(getIsCommentsActive);

	const sceneRedux = useSelector(getScene);
	const sceneModified = useSelector(getSceneModified);

	const dispatch = useDispatch();

	const canvasRef = useRef(null);

	useEffect(() => {
		const canvasCurrent = canvasRef.current;

		dispatch(setCanvas(canvasCurrent));

		// Sizes
		const sizes = {
			width: canvasCurrent.offsetWidth,
			height: canvasCurrent.offsetHeight
		};

		var scene = new THREE.Scene();
		scene.background = new THREE.Color(0xf0f0f0);

		// Base camera
		const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 10000);
		camera.position.z = 500;
		scene.add(camera);

		// LIGHTS
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // color, intensity
		scene.add(ambientLight);

		const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
		directionalLight.position.copy(camera.position);
		directionalLight.castShadow = true;
		scene.add(directionalLight);

		// Renderer
		const renderer = new THREE.WebGLRenderer();
		renderer.setSize(sizes.width, sizes.height);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

		canvasRef.current.appendChild(renderer.domElement);

		// Controls
		const oControls = new OrbitControls(camera, canvasCurrent);
		oControls.enableDamping = true;
		oControls.maxDistance = 2000;

		// the light follow the camera position
		oControls.addEventListener('change', lightUpdate);

		function lightUpdate() {
			directionalLight.position.copy(camera.position);
		}

		// TransformControls
		const tControls = new TransformControls(camera, canvasCurrent);
		tControls.name = 'TransformControls';
		// tControls.addEventListener('change', render);

		tControls.addEventListener('dragging-changed', function(event) {
			oControls.enabled = !event.value;
		});

		scene.add(tControls);

		const axesHelper = new THREE.AxesHelper(5);
		scene.add(axesHelper);

		if (Object.keys(project.objects).length !== 0) {
			for (const object of project.objects) {
				scene.add(new THREE.ObjectLoader().parse(object.object));
			}
		} else {
			const group = new THREE.Group();
			scene.add(group);
		}

		var render = function() {
			// Render
			renderer.render(scene, camera);
			// Update controls
			oControls.update();
			// Call tick again on the next frame
			window.requestAnimationFrame(render);
		};

		const onWindowResize = () => {
			// Update sizes
			sizes.width = canvasCurrent.offsetWidth;
			sizes.height = canvasCurrent.offsetHeight;

			// Update camera
			camera.aspect = sizes.width / sizes.height;
			camera.updateProjectionMatrix();

			// Update renderer
			renderer.setSize(sizes.width, sizes.height);
			renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		};

		window.addEventListener('resize', onWindowResize, false);

		render();

		dispatch(setScene(scene));
		dispatch(setSceneModified(!sceneModified));

		return () => canvasRef.current.removeChild(renderer.domElement);
	}, []);

	return <div ref={canvasRef} className={isCommentsActive ? 'canvas__comments' : 'canvas'} />;
}
