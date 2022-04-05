import React, { useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setHeaderHeight } from "../../features/dimensions/dimensionsSlice";
import AddComment from "../AddComment/AddComment";
import Button from "../Button/Button";
import Import from "../Import/Import";
import Export from "../Export/Export";
import Save from "../Save/Save";
import dashboardIcon from "../../assets/images/icons/th-large-solid.svg";
import { useHistory } from "react-router";
import PropTypes from "prop-types";

export default function Header({ projectId }) {
  const headerRef = useRef(null);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    const headerCurrent = headerRef.current;

    dispatch(setHeaderHeight(headerCurrent.offsetHeight));
  }, []);

  const toDashboard = () => {
    history.push("/");
  };

  return (
    <div className="h-18 flex align-center bg-base" ref={headerRef}>
      <div className="m-3">
        <Button img={dashboardIcon} onClick={toDashboard} title="Dashboard" />
      </div>
      <div className="m-3">
        <Import />
      </div>
      <div className="m-3">
        <Export />
      </div>
      <div className="m-3">
        <Save projectId={projectId} />
      </div>
      <div className="m-3">
        <AddComment />
      </div>
    </div>
  );
}

Header.propTypes = {
  projectId: PropTypes.string,
};
