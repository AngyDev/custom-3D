import React from "react";
import PropTypes from "prop-types";

export default function CommentsItem({ name, text }) {
  return (
    <div className="flex flex-col comments_list__box">
      <span id="name" className="comments_list__username">
        {name}
      </span>
      <span>{text}</span>
    </div>
  );
}

CommentsItem.propTypes = {
  name: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};
