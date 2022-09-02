/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from "prop-types";
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import * as THREE from "three";
import { computeBoundsTree } from "three-mesh-bvh";
import { getIsCommentsActive } from "../../features/comments/commentsSlice";
import { useCreateScene } from "../../hooks/useCreateScene";

THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;

export default function Main({ objects }) {
  const { createScene } = useCreateScene();
  const isCommentsActive = useSelector(getIsCommentsActive);

  const canvasRef = useRef(null);

  useEffect(() => {
    const canvasCurrent = canvasRef.current;

    createScene(canvasCurrent, objects);
  }, []);

  return <div id="canvas" ref={canvasRef} className={isCommentsActive ? "canvas__comments" : "canvas"} />;
}

Main.propTypes = {
  objects: PropTypes.array.isRequired,
};
