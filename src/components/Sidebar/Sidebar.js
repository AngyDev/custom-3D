import React from 'react'
import Panel from '../Panel/Panel';
import AddPlane from '../AddPlane/AddPlane';

export default function Sidebar() {

    return (
        <div className="sidebar">

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
