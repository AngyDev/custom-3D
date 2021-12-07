import React from 'react'

export default function Button(props) {
    return (
        <button
            className={`btn ${props.typeClass}`}
            type={props.type}
            disabled={props.loading}
            onClick={props.onClick}
        >
            {props.text}{props.img && <img className="btn__img" src={props.img} alt="Comments" />}
        </button>
    )
}