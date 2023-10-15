import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { getIsCommentsActive } from "../../features/comments/commentsSlice";
import { useGetCommentsByProjectId } from "../../hooks/useGetCommentsByProjectId";
import { useGetObjectsByProjectId } from "../../hooks/useGetObjectsByProjectId";
import useGetProjectById from "../../hooks/useGetProjectById";
import CommentsListPanel from "../CommentsListPanel/CommentsListPanel";
import Header from "../Header/Header";
import Main from "../Main/Main";
import Sidebar from "../Sidebar/Sidebar";

/**
 * This component is the container for the editor page, it contains the header, the left
 * and right sidebar and the main component with the 3D scene
 * @returns The editor page
 */
export default function LayoutEditor() {
  const { id } = useParams();
  const { project, fetchGetProjectById } = useGetProjectById();
  const { objects, fetchGetObjectsByProjectId } = useGetObjectsByProjectId();
  const { fetchGetCommentsByProjectId } = useGetCommentsByProjectId();

  const isCommentsActive = useSelector(getIsCommentsActive);

  useEffect(() => {
    fetchGetProjectById(id);
    fetchGetObjectsByProjectId(id);
    fetchGetCommentsByProjectId(id);
  }, [id]);

  return (
    <>
      {Object.keys(project).length > 0 && objects !== null && (
        <>
          <Header project={project} />
          <div className="flex">
            <Sidebar />
            <Main objects={objects} />
            {isCommentsActive && <CommentsListPanel projectId={id} />}
          </div>
        </>
      )}
    </>
  );
}
