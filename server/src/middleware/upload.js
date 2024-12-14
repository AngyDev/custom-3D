const formidable = require("formidable");
const fs = require("fs");
const path = require("path");

const uploadFileMiddleware = (req, res, next) => {
  const dir = path.join(process.env.FILE_PATH, "/public/uploads/", req.params.projectId);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const form = new formidable.IncomingForm({
    uploadDir: dir,
    keepExtensions: true, // Keep original file extensions
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      return next(err);
    }

    req.files = files; // Attach files to the request object for further processing
    req.body = fields; // Attach other form fields if needed
    next();
  });
};

module.exports = uploadFileMiddleware;
