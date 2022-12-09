import { useDispatch, useSelector } from "react-redux";
import {
  getSceneModified,
  setCamera,
  setCanvas,
  setControls,
  setPositionVector,
  setRenderer,
  setScene,
  setSceneModified,
} from "../features/scene/sceneSlice";

import * as THREE from "three";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";
import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import { setLoading } from "../features/loading/loadingSlice";
import { filterObjectByName, filterStartsWithName, getMaxCounter, groupByMeasure } from "../utils/common-utils";
import { createLabel, createLabelMeasure } from "../utils/functions/objectLabel";
import { setOpenMeausurePanel } from "../features/measurements/measurementsSlice";
import { setCommentCounter, setMeasureCounter, setPlaneCounter, setScrewCounter } from "../features/counters/countersSlice";
import { negativeVector } from "../utils/functions/objectCalc";
import { dispatchError } from "../features/error/errorSlice";

/**
 * Handles and incorporates the business logic of the Canvas.
 * Creates the 3D scene of the editor page.
 * The createScene function takes the current canvas ref and the list of objects if there are
 * saved objects.
 * @returns CreateScene function
 */
export const useCreateScene = () => {
  const dispatch = useDispatch();
  const sceneModified = useSelector(getSceneModified);

  const ENDPOINT = process.env.REACT_APP_ENDPOINT + "/";

  const createScene = async (canvasCurrent, objects) => {
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

    canvasCurrent.appendChild(renderer.domElement);

    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(sizes.width, sizes.height);
    labelRenderer.domElement.style.position = "absolute";
    labelRenderer.domElement.style.top = "60px";

    canvasCurrent.appendChild(labelRenderer.domElement);

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

    const group = new THREE.Group();
    group.name = "Import";
    scene.add(group);

    // If there are objects recreates the saved scene
    if (objects.length > 0) {
      dispatch(setLoading(true));
      await recreateScene(scene, group, objects);
      dispatch(setLoading(false));
    }

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
  };

  /**
   * Recreates the saved scene
   * @param {THREE.Scene} scene The created scene
   * @param {THREE.Group} group The created group for the imported objects
   */
  const recreateScene = async (scene, group, objects) => {
    const loader = new THREE.ObjectLoader();

    let measureGroups = [];

    const measureGroupsSorted = filterObjectByName("Measure")(objects).sort(function (a, b) {
      if (a.objectName < b.objectName) {
        return -1;
      }
      if (b.objectName < a.objectName) {
        return 1;
      }
      return 0;
    });

    measureGroups = groupByMeasure(measureGroupsSorted, "objectName");

    if (measureGroups.length > 0) {
      for (const measureGroup of measureGroups) {
        // Define two points to calculate the distance
        let point1 = new THREE.Vector3();
        let point2 = new THREE.Vector3();
        // Create a 3D group for each measure
        const groupMeasure = new THREE.Group();
        groupMeasure.name = measureGroup[0].objectName;
        scene.add(groupMeasure);

        // Save the counter for the measure name
        const measureCounter = measureGroup[0].objectName.slice(-1);
        dispatch(setMeasureCounter(Number(measureCounter)));

        for (const measure of measureGroup) {
          const object = await loader.loadAsync(ENDPOINT + measure.objectPath).catch((error) => {
            console.log(error);
            dispatch(dispatchError("Error loading files"));
          });
          groupMeasure.add(object);
        }

        // set the points with the position of the point objects of the measure
        point1 = groupMeasure.children.filter((item) => item.name.includes("start"))[0].position;
        point2 = groupMeasure.children.filter((item) => item.name.includes("end"))[0].position;

        const distance = point1.distanceTo(point2).toFixed(2);

        // create the label with the distance
        for (const mesh of groupMeasure.children) {
          if (mesh.type === "LineSegments") {
            mesh.children = [];
            createLabelMeasure(mesh, distance, measureCounter, point1, point2);
          }
        }
      }
      dispatch(setOpenMeausurePanel(true));
    }

    for (const object of objects) {
      if (!object.objectName.startsWith("Measure")) {
        const mesh = await loader.loadAsync(ENDPOINT + object.objectPath).catch((error) => {
          console.log(error);
          dispatch(dispatchError("Error loading files"));
        });

        if (mesh && mesh.name.startsWith("Group")) {
          // add bounding box for paint function
          mesh.geometry.computeBoundingBox();
          mesh.geometry.computeBoundsTree();
          // save the position vector
          dispatch(setPositionVector(negativeVector(mesh.position)));
          // add the object to the group
          group.add(mesh);
        } else {
          scene.add(mesh);
        }
      }
    }

    // If present sets the plane counter
    const planeCounter = getMaxCounter(filterStartsWithName("Plane")(scene.children));
    dispatch(setPlaneCounter(Number(planeCounter)));

    // create the label of the comments points
    const comments = filterStartsWithName("Comment")(scene.children);
    for (const comment of comments) {
      comment.children = [];
      createLabel(comment);
    }
    // If present sets the comment counter
    const commentCounter = getMaxCounter(comments);
    dispatch(setCommentCounter(Number(commentCounter)));

    // If present sets the screw counter
    const screwCounter = getMaxCounter(filterStartsWithName("Screw")(scene.children));
    dispatch(setScrewCounter(Number(screwCounter)));
  };

  return { createScene };
};
