const formidable = require("formidable");
const fs = require("fs");
const path = require("path");

const uploadFileMiddleware = (req, res) => {
  return new Promise((resolve, reject) => {
    const baseDir = process.env.FILE_PATH || process.cwd();
    const projectDir = req.params.projectId;
    const dir = path.join(baseDir, "public", "uploads", projectDir);

    // Ensure directory exists
    if (!fs.existsSync(dir)) {
      try {
        fs.mkdirSync(dir, { recursive: true });
      } catch (err) {
        console.error("Failed to create directory:", err);
        return reject(err);
      }
    }

    const form = new formidable.IncomingForm({
      uploadDir: dir,
      keepExtensions: true,
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err);
      }

      req.files = files;
      req.body = fields;
      resolve();
    });
  });
};

module.exports = uploadFileMiddleware;
