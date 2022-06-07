import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";

export const createLabel = (object) => {
  const objectDiv = document.createElement("div");
  objectDiv.className = "label";
  objectDiv.textContent = object.name;
  objectDiv.style.marginTop = "2em";
  objectDiv.id = object.name;
  const objectLabel = new CSS2DObject(objectDiv);
  objectLabel.name = "label";
  objectLabel.position.copy(object.position);
  objectLabel.position.set(0, 0, 0);
  object.add(objectLabel);
};
