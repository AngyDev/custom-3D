import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import * as THREE from "three";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";
import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import { getIsCommentsActive } from "../../features/comments/commentsSlice";
import { getSceneModified, setCamera, setCanvas, setControls, setRenderer, setScene, setSceneModified } from "../../features/scene/sceneSlice";

export default function Main({ project }) {
  const isCommentsActive = useSelector(getIsCommentsActive);

  const sceneModified = useSelector(getSceneModified);

  const dispatch = useDispatch();

  const canvasRef = useRef(null);

  useEffect(async () => {
    const canvasCurrent = canvasRef.current;

    dispatch(setCanvas(canvasCurrent));

    // Sizes
    const sizes = {
      width: canvasCurrent.offsetWidth,
      height: canvasCurrent.offsetHeight,
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
    renderer.localClippingEnabled = true;
    renderer.preserveDrawingBuffer = true;

    canvasRef.current.appendChild(renderer.domElement);

    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(sizes.width, sizes.height);
    labelRenderer.domElement.style.position = "absolute";
    labelRenderer.domElement.style.top = "60px";

    canvasRef.current.appendChild(labelRenderer.domElement);

    // Controls
    const oControls = new TrackballControls(camera, canvasCurrent);
    oControls.enableDamping = true;
    oControls.maxDistance = 2000;
    oControls.rotateSpeed = 4;

    // the light follow the camera position
    oControls.addEventListener("change", lightUpdate);

    dispatch(setControls(oControls));

    function lightUpdate() {
      directionalLight.position.copy(camera.position);
    }

    // TransformControls
    const tControls = new TransformControls(camera, canvasCurrent);
    tControls.name = "TransformControls";
    // tControls.addEventListener('change', render);

    tControls.addEventListener("dragging-changed", function (event) {
      oControls.enabled = !event.value;
    });

    scene.add(tControls);

    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    // TODO: Remember when the user import files, checks the group mesh
    if (Object.keys(project.objectsPath).length !== 0) {
      const loader = new THREE.ObjectLoader();

      for (const path of project.objectsPath) {
        const object = await loader.loadAsync("http://localhost:8080/" + path);
        scene.add(object);
      }
    }

    const group = new THREE.Group();
    group.name = "Import";
    scene.add(group);

    var render = function () {
      // Render
      renderer.render(scene, camera);
      labelRenderer.render(scene, camera);
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

      labelRenderer.setSize(sizes.width, sizes.height);
    };

    window.addEventListener("resize", onWindowResize, false);

    render();

    dispatch(setScene(scene));
    dispatch(setRenderer(renderer));
    dispatch(setCamera(camera));
    dispatch(setSceneModified(!sceneModified));

    return () => canvasRef.current.removeChild(renderer.domElement);
  }, []);

  return <div id="canvas" ref={canvasRef} className={isCommentsActive ? "canvas__comments" : "canvas"} />;
}

Main.propTypes = {
  project: PropTypes.object.isRequired,
};
