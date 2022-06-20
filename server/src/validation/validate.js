const { HttpError } = require("../error");

const validateUser = (firstName, lastName, email, password, role) => {
  if (!(firstName && lastName && email && password && role)) {
    throw new HttpError(400, "Missing required fields");
  }
}

const validateProject = (project) => {
  if (!(project.projectName && project.patientCode && project.userId)) {
    throw new HttpError(400, "Missing required fields");
  }
}

module.exports = { validateUser, validateProject };