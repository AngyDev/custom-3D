// TODO: Prova
import * as THREE from "three";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";
import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";

export const createScene = async () => {
  const canvasCurrent = canvasRef.current;

  // dispatch(setCanvas(canvasCurrent));

  // Sizes
  const sizes = {
    width: canvasCurrent.offsetWidth,
    height: canvasCurrent.offsetHeight,
  };

  var scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);

  // Base camera
  const camera = createCamera(sizes);
  scene.add(camera);

  // LIGHTS
  const ambientLight = createAmbientLight();
  scene.add(ambientLight);

  const directionalLight = createDirectionalLight(camera);
  scene.add(directionalLight);

  // Renderer
  const renderer = createRenderer(sizes);

  canvasRef.current.appendChild(renderer.domElement);

  const labelRenderer = createLaberRenderer(sizes);

  canvasRef.current.appendChild(labelRenderer.domElement);

  // Controls
  const oControls = new TrackballControls(camera, canvasCurrent);
  oControls.enableDamping = true;
  oControls.maxDistance = 2000;
  oControls.rotateSpeed = 4;

  // the light follow the camera position
  oControls.addEventListener("change", lightUpdate);

  // dispatch(setControls(oControls));

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

  const geometry = new THREE.BoxGeometry(100, 100, 100);
  const material = new THREE.MeshStandardMaterial({ map: new THREE.TextureLoader().load("../../assets/images/texture/boneRed.jpg") });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  // TODO: Remember when the user import files, checks the group mesh
  if (Object.keys(project.objectsPath).length !== 0) {
    const loader = new THREE.ObjectLoader();

    for (const path of project.objectsPath) {
      const object = await loader.loadAsync(path);
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
};

const createCamera = (sizes) => {
  const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 10000);
  camera.position.z = 500;

  return camera;
};

const createAmbientLight = () => {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // color, intensity

  return ambientLight;
};

const createDirectionalLight = (camera) => {
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.copy(camera.position);
  directionalLight.castShadow = true;

  return directionalLight;
};

const createRenderer = (sizes) => {
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.localClippingEnabled = true;
  renderer.preserveDrawingBuffer = true;

  return renderer;
};

const createLaberRenderer = (sizes) => {
  const labelRenderer = new CSS2DRenderer();
  labelRenderer.setSize(sizes.width, sizes.height);
  labelRenderer.domElement.style.position = "absolute";
  labelRenderer.domElement.style.top = "60px";

  return labelRenderer;
};
