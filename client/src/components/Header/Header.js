import React, { useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setHeaderHeight } from "../../features/dimensions/dimensionsSlice";
import AddComment from "../AddComment/AddComment";
import Button from "../Button/Button";
import Import from "../Import/Import";
import Export from "../Export/Export";
import Save from "../Save/Save";
import dashboardIcon from "../../assets/images/icons/white/th-large-solid.svg";
import { useHistory } from "react-router";
import PropTypes from "prop-types";
import Screenshot from "../Screenshot/Screenshot";

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
    <div className="h-18 flex items-center bg-baseLight dark:bg-base flex-row w-full justify-between p-3" ref={headerRef}>
      <div className="flex flex-row gap-5">
        <Button typeClass="btn__icon" img={dashboardIcon} onClick={toDashboard} title="Dashboard" />
        <Import />
        <Export />
        <Save projectId={projectId} />
        <AddComment />
        <Screenshot />
      </div>
    </div>
  );
}

Header.propTypes = {
  projectId: PropTypes.string,
};
