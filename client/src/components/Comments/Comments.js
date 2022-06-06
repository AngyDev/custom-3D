import React from "react";
import PropTypes from "prop-types";
import CommentsItem from "../CommentsItem/CommentsItem";

export default function Comments({ comments }) {
  return (
    <div className="comments_list">
      <div className="properties">User comments</div>
      {comments.length > 0 && comments.map((item) => <CommentsItem key={item.id} name={item.firstName + " " + item.lastName} text={item.text} />)}
    </div>
  );
}

Comments.propTypes = {
  comments: PropTypes.array.isRequired,
};
