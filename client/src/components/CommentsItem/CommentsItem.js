import React from "react";
import PropTypes from "prop-types";

export default function CommentsItem({ id, name, text, deleteClick }) {
  return (
    <div className="flex justify-between comments_list__box">
      <div className="flex flex-col">
        <span id="name" className="comments_list__username">
          {name}
        </span>
        <span>{text}</span>
      </div>
      <div className="flex items-center">
        <span id={id} name={name} className="delete" onClick={deleteClick}></span>
      </div>
    </div>
  );
}

CommentsItem.propTypes = {
  name: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  deleteClick: PropTypes.func.isRequired,
};
