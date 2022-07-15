const { HttpError } = require("../error");

const validateUser = (firstName, lastName, email, password) => {
  if (!(firstName && lastName && email && password)) {
    throw new HttpError(400, "Missing required fields");
  }
};

const validateLogin = (email, password) => {
  if (!(email && password)) {
    throw new HttpError(400, "Missing required fields");
  }
};

const validateProject = (project) => {
  if (!(project.projectName && project.patientCode && project.userId)) {
    throw new HttpError(400, "Missing required fields");
  }
};

module.exports = { validateUser, validateProject, validateLogin };
