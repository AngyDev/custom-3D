import axios from "axios";

const API_URL = "http://localhost:3000";

export const getProjectById = async (id) => {
  try {
    const res = await axios({
      method: "GET",
      url: `${API_URL}/project/${id}`,
    });

    return res.data;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

export const getProjectsByUserId = async (userId) => {
  try {
    const res = await axios({
      method: "GET",
      url: `${API_URL}/project-user/${userId}`,
    });

    return res.data;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

export const saveProject = async (userId, project) => {
  try {
    const res = await axios({
      method: "POST",
      url: `${API_URL}/project`,
      data: {
        project_name: project.projectName,
        patient_code: project.patientCode,
        status: project.status,
        scene: project.scene,
        assigned_at: project.assignedAt,
        user_id: userId,
      },
    });

    return res.data;
  } catch (error) {
    console.log(error.message);
    return error.message;
  }
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
  } catch (error) {
    return error.message;
  }
};

export const saveComment = async (comment) => {
  try {
    const res = await axios({
      method: "POST",
      url: `${API_URL}/comment`,
      data: {
        project_id: comment.projectId,
        user_id: comment.userId,
        text: comment.text,
        point_id: comment.pointId,
      },
    });

    return res.data;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

export const getCommentsByProjectIdAndPointId = async (projectId, pointId) => {
  try {
    const res = await axios({
      method: "GET",
      url: `${API_URL}/comments/${projectId}/${pointId}`,
    });

    return res.data;
  } catch (error) {
    console.log(error.message);
    return false;
  }
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
