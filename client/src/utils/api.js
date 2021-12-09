import axios from "axios";

const API_URL = "http://localhost:3000";

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
    console.log(userId);
    console.log(project);
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