import PropTypes from "prop-types";
import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import dashboardIcon from "../../assets/images/icons/white/th-large-solid.svg";
import { useAuth } from "../../context/AuthContext";
import { resetComments } from "../../features/comments/commentsSlice";
import { resetCounters } from "../../features/counters/countersSlice";
import { setHeaderHeight } from "../../features/dimensions/dimensionsSlice";
import { dispatchError } from "../../features/error/errorSlice";
import { resetMeasures } from "../../features/measurements/measurementsSlice";
import { resetObjects } from "../../features/objects/objectsSlice";
import { resetProject } from "../../features/project/projectSlice";
import { resetScene } from "../../features/scene/sceneSlice";
import { getProjectById, updateProject } from "../../services/api";
import AddComment from "../AddComment/AddComment";
import Button from "../atoms/Button/Button";
import Export from "../Export/Export";
import Import from "../Import/Import";
import Profile from "../Profile/Profile";
import Save from "../Save/Save";
import Screenshot from "../Screenshot/Screenshot";
import Share from "../Share/Share";

export default function Header({ project }) {
  const { user } = useAuth();
  const headerRef = useRef(null);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    const headerCurrent = headerRef.current;

    dispatch(setHeaderHeight(headerCurrent.offsetHeight));
  }, []);

  const toDashboard = async () => {
    // TODO: check all the elements to remove from the store
    getProjectById(project.id)
      .then((response) => {
        if (response.data.locked !== null && response.data.locked === user.id) {
          updateProject(project.id, { ...response.data, locked: null })
            .then(() => {})
            .catch((error) => {
              dispatch(dispatchError(error));
            });
        }
      })
      .catch((error) => {
        dispatch(dispatchError(error));
      });

    // reset all states
    dispatch(resetScene());
    dispatch(resetProject());
    dispatch(resetObjects());
    dispatch(resetMeasures());
    dispatch(resetCounters());
    dispatch(resetComments());
    history.goBack();
  };

  return (
    <div className="h-18 flex items-center bg-baseLight dark:bg-base flex-row w-full justify-between p-3" ref={headerRef}>
      <div className="flex flex-row gap-5">
        <Button typeClass="btn__icon" img={dashboardIcon} onClick={toDashboard} title="Dashboard" />
        <Import />
        <Export />
        <Save projectId={project.id} disabled={project.archived || project.locked !== user.id} />
        <Share />
        <AddComment />
        <Screenshot />
      </div>
      <div>
        <h1 className="text-white">{project.projectName}</h1>
      </div>
      <div>
        <Profile />
      </div>
    </div>
  );
}

Header.propTypes = {
  project: PropTypes.object,
};
