import React from 'react'

export default function CommentsItem(props) {
    return (
        <div className="flex flex-col comments_list__box">
            <span id="name">{props.name}</span>
            <span>{props.text}</span>
        </div>
    )
}
