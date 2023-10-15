import axios from "./axios-service";

/**
 * Get the user by login info
 * @param {Object} login Email and password of the user
 * @returns The user
 */
export const getUser = async (login) => {
  return await axios.post(`/login`, login);
};

/**
 * Insert a new user
 * @param {Object} user User object
 * @returns The inserted user
 */
export const registerUser = async (user) => {
  return await axios.post(`/register`, user);
};

/**
 * Get the project by project id
 * @param {String} id Project id
 * @returns the project
 */
export const getProjectById = async (id) => {
  return await axios.get(`/project/${id}`);
};

/**
 * Get the objects of project id
 * @param {String} projectId The id of the project
 * @returns A list of objects
 */
export const getObjectsByProjectId = async (projectId) => {
  return await axios.get(`/objects/${projectId}`);
};

// return the project and the objects path
export const getProjectsByUserId = async (userId, archived) => {
  return await axios.get(`/project-user/${userId}/${archived}`);
};

/**
 * Get users
 * @returns The list of all users
 */
export const getUsers = async () => {
  return await axios.get(`/users`);
};

export const saveProject = async (userId, project) => {
  const data = {
    projectName: project.projectName,
    patientCode: project.patientCode,
    status: project.status,
    assignedAt: project.assignedAt,
    userId: userId,
    locked: userId,
  };

  return await axios.post(`/project`, data);
};

export const updateProject = async (projectId, project) => {
  const data =
    Object.keys(project).length > 0
      ? {
          projectName: project.projectName,
          patientCode: project.patientCode,
          status: project.status,
          assignedAt: project.assignedAt,
          archived: project.archived,
          locked: project.locked,
        }
      : {};

  return await axios.put(`/project/${projectId}`, data);
};

export const deleteProject = async (id) => {
  return await axios({
    method: "DELETE",
    url: `/project/${id}`,
  });
};

export const saveObject = async (id, objectName, projectId, file, filename) => {
  let data = new FormData();
  data.append("file", file, filename);
  data.append("id", id);
  data.append("objectName", objectName);

  return await axios.post(`/upload/${projectId}`, data);
};

export const saveComment = async (comment) => {
  return await axios({
    method: "POST",
    url: `/comment`,
    data: {
      projectId: comment.projectId,
      userId: comment.userId,
      text: comment.text,
      pointId: comment.pointId,
    },
  });
};

export const getCommentsByProjectIdAndPointId = async (projectId, pointId) => {
  return await axios({
    method: "GET",
    url: `/comments/${projectId}/${pointId}`,
  });
};

export const getCommentsByProjectId = async (projectId) => {
  return await axios.get(`/comments/${projectId}`);
};

export const deleteObject = async (objectId) => {
  return await axios.delete(`/object/${objectId}`);
};

export const getOffsetMesh = async (data, offset) => {
  try {
    const response = await axios({
      method: "POST",
      url: `/offset`,
      data: {
        data,
        offset,
      },
    });

    return response.data;
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteComment = async (commentId) => {
  try {
    const res = await axios({
      method: "DELETE",
      url: `/comment/${commentId}`,
    });

    return res.data;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

export const getLogout = async (userId) => {
  return await axios.post("/logout", { userId });
};

export const changePassword = async (userId, oldPassword, newPassword) => {
  return await axios.post("/change-password", {
    userId,
    oldPassword,
    newPassword,
  });
};

export const resetPassword = async (email, password) => {
  return await axios.post("/reset-password", {
    email,
    password,
  });
};

export const releaseProjectsLocked = async (userId) => {
  console.log("releaseProjectsLocked", userId);
  return await axios.get(`/release-projects-locked/${userId}`);
};
