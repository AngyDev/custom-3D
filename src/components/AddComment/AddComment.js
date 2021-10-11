import React from 'react';
import Button from '../Button/Button';

export default function AddComment() {

    const handleClick = () => {
        console.log("click");
    }

    return (
        <div>
            <Button typeClass="btn--img" img="../../assets/images/icons/comment-regular.svg" onClick={handleClick}/>
        </div>
    )
}
