import React, { useEffect, useState } from 'react'
import { getProjectsByUserId } from '../utils/api';

export default function useGetProjectsByUserId() {

    const [projects, setProjects] = useState({});
    const userId = "1f9d9634-4915-4fb0-b68f-18db3f37f218";

    useEffect(() => {
        getProjectsByUserId(userId).then(res => {
            setProjects(res);
        })
    }, []);

    return {
        projects
    }
}
