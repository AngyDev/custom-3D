import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { setSidebarWidth } from "../../features/dimensions/dimensionsSlice";
import AddPlane from "../AddPlane/AddPlane";
import Measurements from "../Measurements/Measurements";
import Paint from "../Paint/Paint";
import Panel from "../Panel/Panel";

export default function Sidebar() {
  const sidebarRef = useRef(null);
  const dispatch = useDispatch();
  const [openMeausurePanel, setOpenMeasurePanel] = useState(false);

  useEffect(() => {
    const sidebarCurrent = sidebarRef.current;

    dispatch(setSidebarWidth(sidebarCurrent.offsetWidth));
  }, []);

  return (
    <div className="sidebar" ref={sidebarRef}>
      <div className="sidebar__buttons">
        <div className="sidebar__btn-space flex">
          <AddPlane />
          <Measurements setOpenPanel={setOpenMeasurePanel} openPanel={openMeausurePanel} />
        </div>
        <div className="sidebar__btn-space flex">
          <Paint />
        </div>
      </div>

      <div className="scene__list">
        <div className="scene__panel">
          <h3>Scene</h3>
          <Panel type="scene" />
        </div>
        <div className="scene__panel">
          <h3>Planes</h3>
          <Panel type="planes" />
        </div>
        {openMeausurePanel && (
          <div className="scene__panel">
            <h3>Measurements</h3>
            <Panel type="measure" />
          </div>
        )}
      </div>
    </div>
  );
}
