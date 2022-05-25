const { errorHandler } = require("../utils");
const { memoize } = require("../memoizer/memoize");
const { createOffsetMesh } = require("../functions/offsetObject");

const createOffsetMeshMemo = memoize(createOffsetMesh);

const calculateOffset = errorHandler((req, res) => {
  const { data, offset } = req.body;

  const mesh = createOffsetMeshMemo(data, offset);

  return mesh;
});

module.exports = { calculateOffset };
