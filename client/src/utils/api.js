import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const getProjectById = async (id) => {
  // try {
  //   const res = await axios({
  //     method: "GET",
  //     url: `${process.env.REACT_APP_API_URL}/project/${id}`,
  //   });

  //   return res.data;
  // } catch (error) {
  //   console.log(error.message);
  //   return false;
  // }
  return await axios({
    method: "GET",
    url: `${process.env.REACT_APP_API_URL}/project/${id}`,
  });
};

export const getObjectsByProjectId = async (projectId) => {
  return await axios({
    method: "GET",
    url: `${process.env.REACT_APP_API_URL}/objects/${projectId}`,
  });
};

export const getProjectsByUserId = async (userId) => {
  return await axios({
    method: "GET",
    url: `${process.env.REACT_APP_API_URL}/project-user/${userId}`,
  });
};

export const saveProject = async (userId, project) => {
  try {
    const res = await axios({
      method: "POST",
      url: `${API_URL}/project`,
      data: {
        projectName: project.projectName,
        patientCode: project.patientCode,
        status: project.status,
        assignedAt: project.assignedAt,
        userId: userId,
      },
    });

    return res.data;
  } catch (error) {
    console.log(error.message);
    return error.message;
  }
};

export const updateProject = async (projectId, project) => {
  const data =
    Object.keys(project).length > 0
      ? {
          projectName: project.projectName,
          patientCode: project.patientCode,
          status: project.status,
          assignedAt: project.assignedAt,
        }
      : {};
  try {
    const res = await axios({
      method: "PUT",
      url: `${API_URL}/project/${projectId}`,
      data: data,
    });

    return res.data;
  } catch (error) {
    console.log(error.message);
    return error.message;
  }
};

export const deleteProject = async (id) => {
  return await axios({
    method: "DELETE",
    url: `${process.env.REACT_APP_API_URL}/project/${id}`,
  });
};

export const saveObject = async (id, projectId, file, filename) => {
  let data = new FormData();
  data.append("file", file, filename);
  data.append("id", id);

  try {
    const res = await axios({
      method: "POST",
      url: `${API_URL}/upload/${projectId}`,
      data: data,
    });

    return res.data;
  } catch (error) {
    return error.message;
  }
};

export const saveComment = async (comment) => {
  return await axios({
    method: "POST",
    url: `${API_URL}/comment`,
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
    url: `${API_URL}/comments/${projectId}/${pointId}`,
  });
};

export const deleteObject = async (objectId) => {
  try {
    const res = await axios({
      method: "DELETE",
      url: `${API_URL}/object/${objectId}`,
    });

    return res.data;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

export const getOffsetMesh = async (data, offset) => {
  try {
    const response = await axios({
      method: "POST",
      url: `${API_URL}/offset`,
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
      url: `${API_URL}/comment/${commentId}`,
    });

    return res.data;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};
