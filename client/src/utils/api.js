import axios from "axios";

const API_URL = "http://localhost:3000";

export const getProjectById = async (id) => {
    try {
        const res = await axios({
            method: 'GET',
            url: `${API_URL}/project/${id}`
        });

        return res.data
    } catch (error) {
        console.log(error.message);
        return false;
    }
}

export const getProjectsByUserId = async (userId) => {
    try {
        const res = await axios({
            method: 'GET',
            url: `${API_URL}/project-user/${userId}`
        });

        return res.data
    } catch (error) {
        console.log(error.message);
        return false;
    }
}

export const saveProject = async (userId, project) => {
    try {
        const res = await axios({
            method: 'POST',
            url: `${API_URL}/project`,
            data: {
                project_name: project.projectName,
                patient_code: project.patientCode,
                status: project.status,
                scene: project.scene,
                assigned_at: project.assignedAt,
                user_id: userId
            }
        });

        return res.data
    } catch (error) {
        console.log(error.message)
        return error.message
    }
}

export const saveProjectScene = async (id, scene) => {
    try {
        const res = await axios({
            method: 'POST',
            url: `${API_URL}/project-scene`,
            data: {
                id,
                scene
            }
        });

        return res.data
    } catch (error) {
        console.log(error.message)
        return false
    }
}