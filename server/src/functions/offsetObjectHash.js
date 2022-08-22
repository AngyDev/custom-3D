const { Hashtable } = require("./hashTable");

/**
 * Creates the mesh with offset
 * @param {String} data The data to read
 * @param {Number} offset The offset number to offset the mesh
 */
const createOffsetMesh = (data, offset) => {
  const initialObjects = parseASCII(data);

  const hashTable = createHashTableWithObject(initialObjects);

  const newObjects = initialObjects.map((item) => {
    return {
      ...item,
      normal: [],
      vertices: [],
    };
  });
  
  const finalObjects = calcOffset(hashTable, newObjects, offset);

  return finalObjects;
};

/**
 * Reads the file and creates an object
 * @param {String} data The content of the file
 * @returns The content of the file in an array of objects
 */
const parseASCII = (data) => {
  const patternSolid = /solid([\s\S]*?)endsolid/g;
  const patternFace = /facet([\s\S]*?)endfacet/g;

  const patternFloat = /[\s]+([+-]?(?:\d*)(?:\.\d*)?(?:[eE][+-]?\d+)?)/.source;
  const patternVertex = new RegExp("vertex" + patternFloat + patternFloat + patternFloat, "g");
  const patternNormal = new RegExp("normal" + patternFloat + patternFloat + patternFloat, "g");

  let result;
  let initialObjects = [];

  while ((result = patternSolid.exec(data)) !== null) {
    const solid = result[0];
    let faceNumber = 0;

    while ((result = patternFace.exec(solid)) !== null) {
      const text = result[0];

      faceNumber++;
      const normalV = [];
      const verticesV = [];

      while ((result = patternNormal.exec(text)) !== null) {
        normalV.push(parseFloat(result[1]), parseFloat(result[2]), parseFloat(result[3]));
      }

      while ((result = patternVertex.exec(text)) !== null) {
        const verticesXYZ = [];
        verticesXYZ.push(parseFloat(result[1]), parseFloat(result[2]), parseFloat(result[3]));
        verticesV.push(verticesXYZ);
      }

      let initialObject = {
        face: faceNumber,
        normal: normalV,
        vertices: verticesV,
      };

      initialObjects.push(initialObject);
    }
  }
  return initialObjects;
};

/**
 * Create an hashTable with the initial objects - reduce the complexity of the algorithm
 * @param {Array} initialObjects The data from the file
 * @returns HashTable of objects with the same vertex
 */
const createHashTableWithObject = (initialObjects) => {
  const hashTable = new Hashtable(initialObjects.length);

  for (var i = 0; i < initialObjects.length; i++) {
    for (var j = 0; j < initialObjects[i].vertices.length; j++) {
      // key: the current vertex initialObjects[i].vertices[j]
      // value: the face initialObjects[i].face, the normal initialObjects[i].normal and the position j
      hashTable.set(initialObjects[i].vertices[j], {
        face: initialObjects[i].face,
        normal: initialObjects[i].normal,
        vertexPositionInTheObject: j,
      });
    }
  }

  return hashTable;
};

/**
 * Calculates the offset of the object
 * @param {Hashtable} hashTable The hashTable with the initial objects
 * @param {Array} newObjects The final objects
 * @param {Number} offset The offset to move the mesh
 * @returns The new objects with the offset
 */
const calcOffset = (hashTable, newObjects, offset) => {
  for (var i = 0; i < hashTable.size; i++) {
    if (hashTable.data[i]) {
      for (var j = 0; j < hashTable.data[i].length; j++) {
        // vector hashTable.data[i][j][0];
        // object hashTable.data[i][j][1];

        const normalsSum = calcNormalsSum(hashTable.data[i][j][1]);

        const normalizedNormal = normalizeNormal(normalsSum);

        const newPosition = calcNewPosition(offset, normalizedNormal, hashTable.data[i][j][0]);

        hashTable.data[i][j][1].map((list) => {
          newObjects.find((newObject) => {
            if (newObject.face === list.face) {
              newObject.vertices[list.vertexPositionInTheObject] = newPosition;
            }
          });
        });
      }
    }
  }

  newObjects.map((item) => {
    const newNormal = calculateNewNormal(item.vertices[0], item.vertices[1], item.vertices[2]);
    return {
      ...item,
      normal: item.normal.push(newNormal[0], newNormal[1], newNormal[2]),
    };
  });

  return newObjects;
};

/**
 * Calculates the sum of the normals of the faces
 * @param {Array} tempList Array of objects with the same vertex
 * @returns The sum of all the normals
 */
const calcNormalsSum = (tempList) => {
  // const result = tempList.reduce((prev, curr) => prev + curr.normal, 0);
  let sumX = 0;
  let sumY = 0;
  let sumZ = 0;

  tempList.map((item) => {
    sumX += item.normal[0];
    sumY += item.normal[1];
    sumZ += item.normal[2];
  });

  return [sumX, sumY, sumZ];
};

/**
 * Normalizes the normal vector
 * @param {Array} normal The normal
 * @returns The normalized normal
 */
const normalizeNormal = (normal) => {
  const modul = Math.sqrt(Math.pow(normal[0], 2) + Math.pow(normal[1], 2) + Math.pow(normal[2], 2));

  const normalizedNormal = [normal[0] / modul, normal[1] / modul, normal[2] / modul];

  return normalizedNormal;
};

/**
 * Calculates the new position of the vertex
 * @param {Number} offset The offset
 * @param {Array} normal The normal
 * @param {Array} vertex The vertex
 * @returns The new position of the vertex
 */
const calcNewPosition = (offset, normal, vertex) => {
  return [offset * normal[0] + vertex[0], offset * normal[1] + vertex[1], offset * normal[2] + vertex[2]];
};

/**
 * Calculates the new normal of the face
 * @param {Array} v1 The first vertex
 * @param {Array} v2 The second vertex
 * @param {Array} v3 The third vertex
 * @returns The new normal
 */
const calculateNewNormal = (v1, v2, v3) => {
  const nx = (v2[1] - v1[1]) * (v3[2] - v1[2]) - (v2[2] - v1[2]) * (v3[1] - v1[1]);
  const ny = -((v2[0] - v1[0]) * (v3[2] - v1[2]) - (v2[2] - v1[2]) * (v3[0] - v1[0]));
  const nz = (v2[0] - v1[0]) * (v3[1] - v1[1]) - (v2[1] - v1[1]) * (v3[0] - v1[0]);

  const normal = [nx, ny, nz];
  const normalizedNormal = normalizeNormal(normal);

  return normalizedNormal;
};

module.exports = { createOffsetMesh };
