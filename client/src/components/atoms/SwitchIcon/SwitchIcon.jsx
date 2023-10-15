import React from "react";
import PropTypes from "prop-types";
import Icon from "../Icon/Icon";

export default function SwitchIcon({ className, showIcon, onClick, icon, iconSwitch, altIcon, altIconSwitch }) {
  return (
    <>
      {showIcon ? (
        <Icon className={className} icon={icon} alt={altIcon} onClick={onClick} />
      ) : (
        <Icon className={className} icon={iconSwitch} alt={altIconSwitch} onClick={onClick} />
      )}
    </>
  );
}

SwitchIcon.propTypes = {
  onClick: PropTypes.func.isRequired,
  showIcon: PropTypes.bool.isRequired,
  icon: PropTypes.string.isRequired,
  iconSwitch: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  altIcon: PropTypes.string.isRequired,
  altIconSwitch: PropTypes.string.isRequired,
};
