import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { getIsCommentsActive } from '../../features/comments/commentsSlice';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import Main from '../Main/Main';
import CommentsListPanel from '../CommentsListPanel/CommentsListPanel'
import { useParams } from 'react-router';
import useGetProjectById from '../../hooks/useGetProjectById';

export default function LayoutEditor() {

    const { id } = useParams();
    const { project } = useGetProjectById(id);

    useEffect(() => {
        console.log("id: " + id);
    }, []);

    const isCommentsActive = useSelector(getIsCommentsActive);

    return (
        Object.keys(project).length > 0 &&
        <>
            <Header />
            <div className="flex">
                <Sidebar />
                <Main />
                {
                    isCommentsActive && <CommentsListPanel projectId={project.id}/>
                }
            </div>
        </>
    )
}
