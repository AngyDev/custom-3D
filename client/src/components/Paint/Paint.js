import React, { useEffect } from "react";
import Button from "../Button/Button";
import brushIcon from "../../assets/images/icons/brush-solid.svg";
import * as THREE from "three";
import { useSelector } from "react-redux";
import { getCanvas, getGroup, getScene, getControls } from "../../features/scene/sceneSlice";
import { getHeaderHeight, getSidebarWidth } from "../../features/dimensions/dimensionsSlice";
import { CONTAINED, INTERSECTED, NOT_INTERSECTED } from "three-mesh-bvh";

export default function Paint() {
  const scene = useSelector(getScene);
  const canvas = useSelector(getCanvas);
  const group = useSelector(getGroup);
  const controls = useSelector(getControls);
  const sidebarWidth = useSelector(getSidebarWidth);
  const headerHeight = useSelector(getHeaderHeight);

  const mouse = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();
  const camera = scene.children && scene.children.find((children) => children.type === "PerspectiveCamera");
  let mouseType = -1;
  let brushActive = false;
  let brushMesh;
  const params = {
    size: 0.5,
    color: {
      r: 15,
      g: 78,
      b: 85,
    },
  };

  useEffect(() => {
    window.dispatchEvent(new Event("resize"));

    return () => {
      window.dispatchEvent(new Event("resize"));
    };
  });

  const handleClick = () => {
    const isBrush = scene.children.find((children) => children.name === "Brush");
    if (!isBrush) {
      const brushGeometry = new THREE.SphereBufferGeometry(1, 40, 40);
      const brushMaterial = new THREE.MeshStandardMaterial({
        color: 0xec407a,
        roughness: 0.75,
        metalness: 0,
        transparent: true,
        opacity: 0.5,
        premultipliedAlpha: true,
        emissive: 0xec407a,
        emissiveIntensity: 0.5,
      });

      brushMesh = new THREE.Mesh(brushGeometry, brushMaterial);
      brushMesh.name = "Brush";
      scene.add(brushMesh);

      canvas.addEventListener("pointermove", pointerMove);
      canvas.addEventListener("pointerdown", pointerDown);
      canvas.addEventListener("pointerup", pointerUp);
      canvas.addEventListener("pointermove", pointerColor);
      // canvas.addEventListener("wheel", pointerWheel);
    } else {
      scene.remove(brushMesh);
      canvas.removeEventListener("pointermove", pointerMove);
      canvas.removeEventListener("pointerdown", pointerDown);
      canvas.removeEventListener("pointerup", pointerUp);
      canvas.removeEventListener("pointermove", pointerColor);
    }
  };

  const pointerMove = (event) => {
    mouse.x = ((event.clientX - sidebarWidth) / canvas.offsetWidth) * 2 - 1;
    mouse.y = -((event.clientY - headerHeight) / canvas.offsetHeight) * 2 + 1;
    brushActive = true;
  };

  const pointerDown = (event) => {
    mouse.x = ((event.clientX - sidebarWidth) / canvas.offsetWidth) * 2 - 1;
    mouse.y = -((event.clientY - headerHeight) / canvas.offsetHeight) * 2 + 1;
    mouseType = event.button;

    // disable the controls early if we're over the object because on touch screens
    // we're not constantly tracking where the cursor is.
    raycaster.setFromCamera(mouse, camera);
    raycaster.firstHitOnly = true;

    const res = raycaster.intersectObject(group, true);
    brushActive = true;
    controls.enabled = res.length === 0;
  };

  const pointerUp = (event) => {
    mouseType = -1;
    if (event.pointerType === "touch") {
      // disable the brush visualization when the pointer action is done only
      // if it's on a touch device.
      brushActive = false;
    }
  };

  const pointerColor = () => {
    if (controls.active || !brushActive) {
      brushMesh.visible = false;
    } else {
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
      raycaster.firstHitOnly = true;

      const res = raycaster.intersectObject(group, true);

      if (res.length > 0) {
        brushMesh.scale.setScalar(params.size);

        const geometry = res[0].object.geometry;
        const bvh = geometry.boundsTree;
        const colorAttr = geometry.getAttribute("color");
        const indexAttr = geometry.index;

        brushMesh.position.copy(res[0].point);
        controls.enabled = false;
        brushMesh.visible = true;

        const inverseMatrix = new THREE.Matrix4();
        inverseMatrix.copy(res[0].object.matrixWorld).invert();

        const sphere = new THREE.Sphere();
        sphere.center.copy(brushMesh.position).applyMatrix4(inverseMatrix);
        sphere.radius = params.size;

        const indices = [];
        const tempVec = new THREE.Vector3();
        bvh.shapecast({
          intersectsBounds: (box) => {
            const intersects = sphere.intersectsBox(box);
            const { min, max } = box;
            if (intersects) {
              for (let x = 0; x <= 1; x++) {
                for (let y = 0; y <= 1; y++) {
                  for (let z = 0; z <= 1; z++) {
                    tempVec.set(x === 0 ? min.x : max.x, y === 0 ? min.y : max.y, z === 0 ? min.z : max.z);
                    if (!sphere.containsPoint(tempVec)) {
                      return INTERSECTED;
                    }
                  }
                }
              }

              return CONTAINED;
            }

            return intersects ? INTERSECTED : NOT_INTERSECTED;
          },

          intersectsTriangle: (tri, i, contained) => {
            if (contained || tri.intersectsSphere(sphere)) {
              const i3 = 3 * i;
              indices.push(i3, i3 + 1, i3 + 2);
            }

            return false;
          },
        });

        if (mouseType === 0 || mouseType === 2) {
          let r = 255,
            g = 255,
            b = 255;
          if (mouseType === 0) {
            r = params.color.r;
            g = params.color.g;
            b = params.color.b;
          }

          for (let i = 0, l = indices.length; i < l; i++) {
            const i2 = indexAttr.getX(indices[i]);
            colorAttr.setX(i2, r);
            colorAttr.setY(i2, g);
            colorAttr.setZ(i2, b);
          }

          colorAttr.needsUpdate = true;
        }
      } else {
        controls.enabled = true;
        brushMesh.visible = false;
      }
    }
  };

  const changeBrushSize = (event) => {
    const { value } = event.target;
    params.size = value;
  };

  const changeBrushColor = (event) => {
    const { value } = event.target;
    params.color.r = parseInt(value.substr(1, 2), 16);
    params.color.g = parseInt(value.substr(3, 2), 16);
    params.color.b = parseInt(value.substr(5, 2), 16);
  };

  return (
    <>
      <Button img={brushIcon} onClick={handleClick} title="Paint" />
      <div className="flex gap-2 items-center">
        <span className="text-sm">Brush size: </span>
        <input type="range" min="0.5" max="4" step="0.5" defaultValue={params.size} onMouseUp={changeBrushSize} />
        <input id="color" type="color" className="w-8 border-none" defaultValue="#0F4E55" onChange={changeBrushColor} />
      </div>
    </>
  );
}
