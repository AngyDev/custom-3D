import React, { useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";
import { CSS2DRenderer, CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import { getIsCommentsActive } from "../../features/comments/commentsSlice";
import { getSceneModified, getScene, setScene, setSceneModified, setCanvas } from "../../features/scene/sceneSlice";

export default function Main({ project }) {
  const isCommentsActive = useSelector(getIsCommentsActive);

  const sceneRedux = useSelector(getScene);
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

    canvasRef.current.appendChild(renderer.domElement);

    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(sizes.width, sizes.height);
    labelRenderer.domElement.style.position = "absolute";
    labelRenderer.domElement.style.top = "0px";

    canvasRef.current.appendChild(labelRenderer.domElement);

    // Controls
    const oControls = new OrbitControls(camera, canvasCurrent);
    oControls.enableDamping = true;
    oControls.maxDistance = 2000;

    // the light follow the camera position
    oControls.addEventListener("change", lightUpdate);

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
    // if (Object.keys(project.objects).length !== 0) {
    //   for (const object of project.objects) {
    //     scene.add(new THREE.ObjectLoader().parse(object.object));
    //   }
    // }

    // if (Object.keys(project.objectsPath).length !== 0) {
    //   const loader = new THREE.ObjectLoader();
    //   // "/Users/angelabusato/github/custom-3D/server/src/resources/static/assets/uploads/4f40ccd1-4161-4861-9c99-0bbb2a0bba8b/5EA85E14-3C1A-407C-8012-F72833677ECE.json"
    //   const object = await loader.load(project.objectsPath[0]);
    //   // const object = await loader.loadAsync("http://127.0.0.1:8080/src/resources/static/assets/uploads/4f40ccd1-4161-4861-9c99-0bbb2a0bba8b/5EA85E14-3C1A-407C-8012-F72833677ECE.json");
    //   console.log(object);
    //   // for (const path of project.objectsPath) {
    //   //   const obj = await loader.load(path);
    //   //   console.log(obj);
    //   // }
    // }

    const group = new THREE.Group();
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
    dispatch(setSceneModified(!sceneModified));

    return () => canvasRef.current.removeChild(renderer.domElement);
  }, []);

  return <div ref={canvasRef} className={isCommentsActive ? "canvas__comments" : "canvas"} />;
}
