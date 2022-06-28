import React from "react";
import PropTypes from "prop-types";

export default function CommentsItem({ uuid, id, name, text, deleteClick }) {
  return (
    <div className="flex justify-between comments_list__box">
      <div className="flex flex-col">
        <span id="name" className="comments_list__username">
          {name}
        </span>
        <span>{text}</span>
      </div>
      <div className="flex items-center">{uuid === "" && <span id={id} name={name} className="delete" onClick={deleteClick}></span>}</div>
    </div>
  );
}

CommentsItem.propTypes = {
  uuid: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  deleteClick: PropTypes.func.isRequired,
};
