import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSidebarWidth } from "../../features/dimensions/dimensionsSlice";
import { getOpenMeausurePanel } from "../../features/measurements/measurementsSlice";
import AddPlane from "../AddPlane/AddPlane";
import Clipping from "../Clipping/Clipping";
import Measurements from "../Measurements/Measurements";
import Paint from "../Paint/Paint";
import Panel from "../Panel/Panel";
import minusIcon from "../../assets/images/icons/white/minus-solid.svg";
import plusIcon from "../../assets/images/icons/white/plus-solid.svg";
import AddScrew from "../AddScrew/AddScrew";

export default function Sidebar() {
  const sidebarRef = useRef(null);
  const dispatch = useDispatch();
  const openMeausurePanel = useSelector(getOpenMeausurePanel);
  const [openScene, setOpenScene] = useState(true);
  const [openScrew, setOpenScrew] = useState(false);

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
          <Measurements openPanel={openMeausurePanel} />
          <AddScrew setOpenScrew={setOpenScrew} />
        </div>
        <div className="sidebar__btn-space">
          <Paint />
        </div>
      </div>

      <div className="scene__list">
        <div className="scene__panel">
          <div className="properties flex justify-between items-center">
            <span>Scene tree</span>
            {openScene ? (
              <img className="w-4 h-4 cursor-pointer" src={minusIcon} alt="Minus" onClick={() => setOpenScene(false)} />
            ) : (
              <img className="w-4 h-4 cursor-pointer" src={plusIcon} alt="Plus" onClick={() => setOpenScene(true)} />
            )}
          </div>
          {openScene && <Panel type="scene" />}
        </div>
        <div className="scene__panel">
          <div className="properties">Planes tree & tools</div>
          <Clipping />
          <div className="mb-2"></div>
          <Panel type="planes" scroll={scroll} />
        </div>
        {openMeausurePanel && (
          <div className="scene__panel">
            <div className="properties">Measurements tree</div>
            <Panel type="measure" />
          </div>
        )}
        <div className="scene__panel">
          <div className="properties flex justify-between items-center">
            <span>Screw tree</span>
            {openScrew ? (
              <img className="w-4 h-4 cursor-pointer" src={minusIcon} alt="Minus" onClick={() => setOpenScrew(false)} />
            ) : (
              <img className="w-4 h-4 cursor-pointer" src={plusIcon} alt="Plus" onClick={() => setOpenScrew(true)} />
            )}
          </div>
          {openScrew && <Panel type="screw" />}
        </div>
      </div>
    </div>
  );
}
