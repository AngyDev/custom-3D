import React from 'react';
import { useSelector } from 'react-redux';
import Header from '../../components/Header/Header';
import Main from '../../components/Main/Main';
import Sidebar from '../../components/Sidebar/Sidebar';
import CommentsListPanel from "../../components/CommentsListPanel/CommentsListPanel";
import { getIsCommentsActive } from '../comments/commentsSlice';

export default function App() {

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
