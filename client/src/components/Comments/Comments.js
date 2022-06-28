import PropTypes from "prop-types";
import React from "react";
import CommentsItem from "../CommentsItem/CommentsItem";

export default function Comments({ comments, deleteElement }) {
  return (
    <>
      <div className="comments_list">
        <div className="properties">User comments</div>
        {comments.length > 0 &&
          comments.map((item, index) => (
            <CommentsItem
              key={index}
              id={index}
              uuid={item.id ? item.id : ""}
              name={item.firstName + " " + item.lastName}
              text={item.text}
              deleteClick={deleteElement}
            />
          ))}
      </div>
    </>
  );
}

Comments.propTypes = {
  comments: PropTypes.array.isRequired,
  deleteElement: PropTypes.func.isRequired,
};
