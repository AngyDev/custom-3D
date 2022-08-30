import * as THREE from "three";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils";

/**
 * Creates a mesh from an objects with normals and vertices
 * @param {Object} object This is an object with normals and vertices
 * @returns THREE.Mesh
 */
export const createMeshFromObject = (object) =>
  new Promise((resolve) => {
    const geometry = new THREE.BufferGeometry();
    const material = new THREE.MeshStandardMaterial({
      color: "#fff000",
      side: THREE.DoubleSide,
      vertexColors: true,
    });

    const normals = [];
    const vertices = [];

    object.map((item) => {
      item.vertices.map((vertex) => {
        normals.push(item.normal[0], item.normal[1], item.normal[2]);
        vertices.push(vertex[0], vertex[1], vertex[2]);
      });
    });

    let normalsPosition = new Float32Array(object.length * 3 * 3);
    let verticesPosition = new Float32Array(object.length * 3 * 3);

    for (let i = 0; i < normals.length; i = i + 3) {
      normalsPosition[i] = normals[i];
      normalsPosition[i + 1] = normals[i + 1];
      normalsPosition[i + 2] = normals[i + 2];

      verticesPosition[i] = vertices[i];
      verticesPosition[i + 1] = vertices[i + 1];
      verticesPosition[i + 2] = vertices[i + 2];
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(verticesPosition, 3));
    geometry.setAttribute("normal", new THREE.BufferAttribute(normalsPosition, 3));

    const newGeometry = mergeVertices(geometry);
    newGeometry.computeVertexNormals();

    const colorArray = new Uint8Array(newGeometry.attributes.position.count * 3);
    colorArray.fill(255);
    const colorAttr = new THREE.BufferAttribute(colorArray, 3, true);
    colorAttr.setUsage(THREE.DynamicDrawUsage);
    newGeometry.setAttribute("color", colorAttr);

    const mesh = new THREE.Mesh(newGeometry, material);

    resolve(mesh);
  });
