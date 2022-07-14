import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useAuth } from "../../context/AuthContext";
import { dispatchError } from "../../features/error/errorSlice";
import { getLogout } from "../../services/api";
import Dropdown from "../Dropdown/Dropdown";

export default function Profile() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const changePassword = () => {};

  const logoutUser = () => {
    getLogout(user.id)
      .then(() => logout())
      .catch((error) => dispatch(dispatchError(error)));
  };

  return (
    <Dropdown
      open={open}
      setOpen={() => setOpen(!open)}
      text={`${user.firstName} ${user.lastName}`}
      options={[
        { text: "Change Password", onClick: changePassword },
        { text: "Logout", onClick: logoutUser },
      ]}
    />
  );
}
