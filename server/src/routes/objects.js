const express = require("express");
const { ObjectsController } = require("../controllers/ObjectsController");
const { ProjectsController } = require("../controllers/ProjectsController");
// const { default as uploadFile } = require("../connectors/aws_s3");
// const multer = require("multer");
// const fs = require("fs");
const api = require("../api/objects");

const router = express.Router();

router.get("/object/:id", api.getObjectById);
router.get("/objects/:projectId/", api.getObjectsPathByProjectId);
router.post("/upload/:projectId", api.uploadFileAndSaveObject);
router.delete("/object/:id", api.deleteObject);
// router.get("/objects/:projectId", api.getObjectsByProjectId);

// const storage = multer.diskStorage({ dest: "temp/" });
// const upload = multer({ storage: storage });

// /**
//  * Save object on local aws
//  */
// router.post("/upload/:projectId", upload.single("file"), function (req, res) {
//   if (req.file === undefined) {
//     return res.status(400).send({ message: "Please upload a file!" });
//   }

//   const file = req.file;
//   const folder = req.params.projectId;
//   let filelocation;

//   // Checks if the project exist
//   const findProject = ProjectsController.getProjectById(req.params.projectId);

//   if (!findProject) return res.status(404).send("Project not found");

//   uploadFile(file, file.originalname, folder)
//     .then((response) => {
//       console.log("<<Uploaded file to S3>>");
//       console.log(response);
//       filelocation = response.Location;
//       // res.status(200).send({ filelocation });

//       const filepath = response.Key;
//       const objectId = req.body.id;
//       const projectId = req.params.projectId;

//       // Saves the object in the db
//       ObjectsController.saveObject(objectId, projectId, filepath).then((response) => {
//         res.status(200).send({
//           message: "Uploaded the file successfully: " + req.file.originalname,
//         });
//       }).catch((err) => {
//         console.error(err);
//       })

//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(400).send("Error");
//     });
// });

module.exports = router;
