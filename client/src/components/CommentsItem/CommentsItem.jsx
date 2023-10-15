import React from "react";
import PropTypes from "prop-types";
import { format } from "date-fns";

export default function CommentsItem({ uuid, id, name, text, date, deleteClick }) {
  return (
    <div className="flex justify-between comments_list__box">
      <div className="flex flex-col w-full">
        <div className="flex justify-between">
          <div id="name" className="comments_list__username">
            {name}
          </div>
          <div>{date ? format(new Date(date), "dd/MM/yyyy") : ""}</div>
        </div>
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
  date: PropTypes.string.isRequired,
  deleteClick: PropTypes.func.isRequired,
};
