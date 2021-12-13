import React, { useEffect, useState } from 'react'
import { getProjectById } from '../utils/api';

export default function useGetProjectById(id) {

    const [project, setProject] = useState({});

    useEffect(() => {
        getProjectById(id).then(res => {
            setProject(res);
        })
    }, []);

    return {
        project
    }
}