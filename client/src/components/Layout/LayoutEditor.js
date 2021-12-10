import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { getIsCommentsActive } from '../../features/comments/commentsSlice';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import Main from '../Main/Main';
import CommentsListPanel from '../CommentsListPanel/CommentsListPanel'
import { useParams } from 'react-router';

export default function LayoutEditor() {

    const { id } = useParams();
    
    useEffect(() => {
        console.log("id: " + id);
    }, []);
    
    const isCommentsActive = useSelector(getIsCommentsActive);

    return (
        <div className="app">
            <Header />
            <div className="flex">
                <Sidebar />
                <Main />
                {
                    isCommentsActive && <CommentsListPanel />
                }
            </div>
        </div>
    )
}
