import React from 'react'
import Panel from '../Panel/Panel';
import Button from '../Button/Button';

export default function Sidebar() {

    const addPlane = () => {

    }

    return (
        <div className="sidebar">

            <div className="sidebar__buttons">
                <Button typeClass="btn--size" text="ADD PLANE" onClick={addPlane}/>
            </div>

            <div className="scene__list">
                <div className="scene__panel">
                    <h3>Scene</h3>
                    <Panel />
                </div>
                <div className="scene__panel">
                    <h3>Planes</h3>
                </div>
            </div>
        </div>
    )
}
