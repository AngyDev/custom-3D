import React from 'react'
import Panel from '../Panel/Panel'

export default function Sidebar() {
    return (
        <div className="sidebar">
            <div className="scene__list">
                <div className="scene__panel">
                    <h3>Scene</h3>
                    <Panel />
                </div>
            </div>
        </div>
    )
}
