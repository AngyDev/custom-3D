import express from "express";
import { createOffsetMesh } from "../functions/offsetObject";
import { memoize } from "../memoizer/memoize";

const router = express.Router();

const createOffsetMeshMemo = memoize(createOffsetMesh);

router.post("/offset", (req, res) => {
  const { data, offset } = req.body;

  const mesh = createOffsetMeshMemo(data, offset);

  res.send(mesh);
});

module.exports = router;
