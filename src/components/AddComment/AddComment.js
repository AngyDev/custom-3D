import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getIsCommentsActive, setCommentsActive } from '../../features/comments/commentsSlice';
import Button from '../Button/Button';

export default function AddComment() {

    const isCommentsActive = useSelector(getIsCommentsActive);
    const dispatch = useDispatch();

    const handleClick = () => {
        dispatch(setCommentsActive(!isCommentsActive));
    }

    return (
        <div>
            <Button typeClass="btn--img" img="../../assets/images/icons/comment-regular.svg" onClick={handleClick}/>
        </div>
    )
}
