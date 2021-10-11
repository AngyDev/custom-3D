import React, { useEffect } from 'react';

export default function CommentsListPanel() {

    // Dispatch the resize event to recalculate the width of the canvas when the bar is open and close (return)
    useEffect(() => {
        window.dispatchEvent(new Event('resize'));

        return () => {
            window.dispatchEvent(new Event('resize'));
        }
    })

    return (
        <div className="commentsListPanel">
            <h3>Comments</h3>
        </div>
    )
}
