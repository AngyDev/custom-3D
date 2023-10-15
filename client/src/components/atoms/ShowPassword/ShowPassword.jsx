import React from "react";
import PropTypes from "prop-types";
import Icon from "../Icon/Icon";
import eyeIcon from "../../../assets/images/icons/black/eye-solid.svg";
import eyeSlashIcon from "../../../assets/images/icons/black/eye-slash-solid.svg";

export default function ShowPassword({ showPassword, onClick }) {
  return (
    <>
      {showPassword ? (
        <Icon className="w-5 h-5 cursor-pointer" icon={eyeSlashIcon} alt="Hide password" onClick={onClick} />
      ) : (
        <Icon className="w-5 h-5 cursor-pointer" icon={eyeIcon} alt="Show password" onClick={onClick} />
      )}
    </>
  );
}

ShowPassword.propTypes = {
  onClick: PropTypes.func.isRequired,
  showPassword: PropTypes.bool.isRequired,
};
