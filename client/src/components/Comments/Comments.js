import React from "react";
import CommentsItem from "../CommentsItem/CommentsItem";

export default function Comments(data) {
  return (
    <div className="comments_list">
      <h3>User Comments</h3>
      <hr />
      {data.length > 0 && data.map((item) => <CommentsItem key={item.id} name={item.firstName + " " + item.lastName} text={item.text} />)}
    </div>
  );
}
