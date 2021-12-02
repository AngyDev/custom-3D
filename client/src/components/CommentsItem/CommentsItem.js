import React from 'react'

export default function CommentsItem(props) {
    return (
        <div className="flex flex-col comments_list__box">
            <span id="name" className="comments_list__username">{props.name}</span>
            <span>{props.text}</span>
        </div>
    )
}
