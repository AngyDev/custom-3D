import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { setSidebarWidth } from "../../features/dimensions/dimensionsSlice";
import AddPlane from "../AddPlane/AddPlane";
import Clipping from "../Clipping/Clipping";
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
    <div className="sidebar text-white bg-baseLight dark:bg-base" ref={sidebarRef}>
      <div>
        <div className="properties">Tools</div>
        <div className="sidebar__btn-space flex">
          <AddPlane />
          <Measurements setOpenPanel={setOpenMeasurePanel} openPanel={openMeausurePanel} />
        </div>
        <div className="sidebar__btn-space">
          <Paint />
        </div>
      </div>

      <div className="scene__list">
        <div className="scene__panel">
          <div className="properties">Scene tree</div>
          <Panel type="scene" />
        </div>
        <div className="scene__panel">
          <div className="properties">Planes tree & tools</div>
          <Clipping />
          <div className="mb-2"></div>
          <Panel type="planes" />
        </div>
        {openMeausurePanel && (
          <div className="scene__panel">
            <div className="properties">Measurements tree</div>
            <Panel type="measure" />
          </div>
        )}
      </div>
    </div>
  );
}
