import React, { useEffect } from 'react';
import Button from "../Button/Button";

export default function CommentsListPanel() {

    // Dispatch the resize event to recalculate the width of the canvas when the bar is open and close (return)
    useEffect(() => {
        window.dispatchEvent(new Event('resize'));

        return () => {
            window.dispatchEvent(new Event('resize'));
        }
    });

    const handleClick = () => {
        
    }

    return (
        <div className="commentsListPanel">
            <h3>Comments</h3>
            <div className="sidebar__buttons">
                <Button typeClass="btn--size" text="ADD COMMENT" onClick={handleClick}/>
            </div>
        </div>
    )
}
