import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { getIsCommentsActive } from "../../features/comments/commentsSlice";
import useGetProjectById from "../../hooks/useGetProjectById";
import CommentsListPanel from "../CommentsListPanel/CommentsListPanel";
import Header from "../Header/Header";
import Main from "../Main/Main";
import Sidebar from "../Sidebar/Sidebar";

export default function LayoutEditor() {
  const { id } = useParams();
  const { project } = useGetProjectById(id);

  const isCommentsActive = useSelector(getIsCommentsActive);

  return (
    <>
      {Object.keys(project).length > 0 && (
        <>
          <Header projectId={id} />
          <div className="flex">
            <Sidebar />
            <Main project={project} />
            {isCommentsActive && <CommentsListPanel projectId={id} />}
          </div>
        </>
      )}
    </>
  );
}
