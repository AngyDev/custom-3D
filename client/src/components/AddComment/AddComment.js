import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { getIsCommentsActive, setCommentsActive } from "../../features/comments/commentsSlice";
import Button from "../Button/Button";
import commentIcon from "../../assets/images/icons/white/comment-regular.svg";

export default function AddComment() {
  const isCommentsActive = useSelector(getIsCommentsActive);
  // const isTextOpen = useSelector(getIsTextOpen);
  const dispatch = useDispatch();

  const handleClick = () => {
    // dispatch(setIsTextOpen(false));
    dispatch(setCommentsActive(!isCommentsActive));
  };

  return (
    <div>
      <Button typeClass="btn--img btn__icon" img={commentIcon} onClick={handleClick} title="Add comment" />
    </div>
  );
}
