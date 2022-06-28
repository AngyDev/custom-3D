const express = require("express");
const api = require("../api/objects");

const router = express.Router();

router.get("/object/:id", api.getObjectById);
// router.get("/objects/path/:projectId/", api.getObjectsPathByProjectId);
router.get("/objects/:projectId/", api.getObjectsByProjectId);
router.post("/upload/:projectId", api.uploadFileAndSaveObject);
router.delete("/object/:id", api.deleteObject);

module.exports = router;
