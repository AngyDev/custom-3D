import React, { useEffect, useRef } from 'react'
import Panel from '../Panel/Panel';
import AddPlane from '../AddPlane/AddPlane';
import { setSidebarWidth } from '../../features/dimensions/dimensionsSlice';
import { useDispatch } from 'react-redux';

export default function Sidebar() {

    const sidebarRef = useRef(null);
    const dispatch = useDispatch();

    useEffect(() => {
        const sidebarCurrent = sidebarRef.current;

        dispatch(setSidebarWidth(sidebarCurrent.offsetWidth));
    }, [])

    return (
        <div className="sidebar" ref={sidebarRef}>

            <div className="sidebar__buttons">
                <AddPlane />
            </div>

            <div className="scene__list">
                <div className="scene__panel">
                    <h3>Scene</h3>
                    <Panel type="scene" />
                </div>
                <div className="scene__panel">
                    <h3>Planes</h3>
                    <Panel type="planes" />
                </div>
            </div>
        </div>
    )
}
