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
import SwitchIcon from "../atoms/SwitchIcon/SwitchIcon";

export default function Sidebar() {
  const sidebarRef = useRef(null);
  const dispatch = useDispatch();
  const openMeasurePanel = useSelector(getOpenMeausurePanel);
  const [openScene, setOpenScene] = useState(true);
  const [openPlane, setOpenPlane] = useState(true);
  const [openScrew, setOpenScrew] = useState(false);
  const [openMeasure, setOpenMeasure] = useState(!openMeasurePanel);

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
          <Measurements openPanel={openMeasurePanel} />
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
            <SwitchIcon
              showIcon={openScene}
              className="w-4 h-4 cursor-pointer"
              icon={minusIcon}
              altIcon="Minus"
              altIconSwitch="Plus"
              iconSwitch={plusIcon}
              onClick={() => setOpenScene(!openScene)}
            />
          </div>
          {openScene && <Panel type="scene" />}
        </div>
        <div className="scene__panel">
          <div className="properties flex justify-between items-center">
            <span>Planes tree & tools</span>
            <SwitchIcon
              showIcon={openPlane}
              className="w-4 h-4 cursor-pointer"
              icon={minusIcon}
              altIcon="Minus"
              altIconSwitch="Plus"
              iconSwitch={plusIcon}
              onClick={() => setOpenPlane(!openPlane)}
            />
          </div>
          <Clipping />
          <div className="mb-2"></div>
          {openPlane && <Panel type="planes" scroll={scroll} />}
        </div>
        {openMeasurePanel && (
          <div className="scene__panel">
            <div className="properties flex justify-between items-center">
              <span>Measurements tree</span>
              <SwitchIcon
                showIcon={openMeasure}
                className="w-4 h-4 cursor-pointer"
                icon={minusIcon}
                altIcon="Minus"
                altIconSwitch="Plus"
                iconSwitch={plusIcon}
                onClick={() => setOpenMeasure(!openMeasure)}
              />
            </div>
            {openMeasure && <Panel type="measure" />}
          </div>
        )}
        <div className="scene__panel">
          <div className="properties flex justify-between items-center">
            <span>Screw tree</span>
            <SwitchIcon
              showIcon={openScrew}
              className="w-4 h-4 cursor-pointer"
              icon={minusIcon}
              altIcon="Minus"
              altIconSwitch="Plus"
              iconSwitch={plusIcon}
              onClick={() => setOpenScrew(!openScrew)}
            />
          </div>
          {openScrew && <Panel type="screw" />}
        </div>
      </div>
    </div>
  );
}
