import React from 'react';
import Header from '../../components/Header/Header';
import Main from '../../components/Main/Main';
import Sidebar from '../../components/Sidebar/Sidebar';

export default function App() {
    return (
        <div className="app">
            <Header />
            <div className="flex">
                <Sidebar />
                <Main />
            </div>
        </div>
    )
}
