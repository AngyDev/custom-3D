import React, { useEffect, useState } from 'react'
import { getProjectsByUserId } from '../utils/api';

export default function useGetProjectsByUserId() {

    const [projects, setProjects] = useState({});
    const userId = "d27db05e-fb3f-4942-a517-59fefbd97937";

    useEffect(() => {
        getProjectsByUserId(userId).then(res => {
            setProjects(res);
        })
    }, []);

    return {
        projects
    }
}
