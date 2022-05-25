import express from "express";
import { ObjectsController } from "../controllers/ObjectsController";
import { ProjectsController } from "../controllers/ProjectsController";
import { default as uploadFile } from "../connectors/aws_s3";
const multer = require("multer");
const fs = require("fs");

const router = express.Router();

/**
 * Get Object by id
 */
router.get("/object/:objectId", async (req, res) => {
  try {
    const objectId = req.params.objectId;
    const response = await ObjectsController.getObjectById(objectId);

    if (response) {
      res.send(response);
    } else {
      res.status(404).send("Not found");
    }
  } catch (error) {
    console.error(error);
  }
});

/**
 * Get objects by project id
 */
router.get("/objects/:projectId/", async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const response = await ObjectsController.getObjectsPathByProjectId(projectId);

    const objectsPath = [];

    if (response) {
      for (const object of response) {
        const path = process.env.AWS_S3_SERVER + "/" + process.env.AWS_BUCKET_NAME + "/" + object["objectPath"];
        objectsPath.push(path);
      }

      res.send(objectsPath);
    } else {
      res.status(404).send("Not found");
    }
  } catch (error) {
    console.error(error);
  }
});

const storage = multer.diskStorage({ dest: "temp/" });
const upload = multer({ storage: storage });

/**
 * Save object on local aws
 */
router.post("/upload/:projectId", upload.single("file"), function (req, res) {
  if (req.file === undefined) {
    return res.status(400).send({ message: "Please upload a file!" });
  }

  const file = req.file;
  const folder = req.params.projectId;
  let filelocation;

  // Checks if the project exist
  const findProject = ProjectsController.getProjectById(req.params.projectId);

  if (!findProject) return res.status(404).send("Project not found");

  uploadFile(file, file.originalname, folder)
    .then((response) => {
      console.log("<<Uploaded file to S3>>");
      console.log(response);
      filelocation = response.Location;
      // res.status(200).send({ filelocation });

      const filepath = response.Key;
      const objectId = req.body.id;
      const projectId = req.params.projectId;

      // Saves the object in the db
      ObjectsController.saveObject(objectId, projectId, filepath).then((response) => {
        res.status(200).send({
          message: "Uploaded the file successfully: " + req.file.originalname,
        });
      }).catch((err) => {
        console.error(err);
      })

    })
    .catch((err) => {
      console.log(err);
      res.status(400).send("Error");
    });
});

/**
 * Save object
 */
router.post("/object", async (req, res) => {
  try {
    const findProject = await ProjectsController.getProjectById(req.body.project_id);

    if (!findProject) return res.status(404).send("Project not found");

    const createObject = await ObjectsController.createObject(req.body);
    return res.status(200).json(createObject);
  } catch (error) {
    res.status(400).json(error.message);
    console.error(error);
  }
});

/**
 * Deletes object and comments
 */
router.delete("/object/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const deleteObject = await ObjectsController.deleteObject(id);
    res.send("The object sucessfully deleted");
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
