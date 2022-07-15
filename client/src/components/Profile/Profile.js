import React, { useState } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { useAuth } from "../../context/AuthContext";
import { dispatchError } from "../../features/error/errorSlice";
import { changePassword, getLogout } from "../../services/api";
import Button from "../Button/Button";
import Dropdown from "../Dropdown/Dropdown";
import Modal from "../Modal/Modal";
import { useForm } from "react-hook-form";
import InputForm from "../atoms/InputForm/InputForm";
import ShowPassword from "../atoms/ShowPassword/ShowPassword";

export default function Profile() {
  const { user, logout } = useAuth();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const changePassword = () => {
    setIsOpen(true);
    setOpen(false);
  };

  const logoutUser = () => {
    getLogout(user.id)
      .then(() => logout())
      .catch((error) => dispatch(dispatchError(error)));
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Dropdown
        open={open}
        setOpen={() => setOpen(!open)}
        text={`${user.firstName} ${user.lastName}`}
        options={[
          { text: "Change Password", onClick: changePassword },
          { text: "Logout", onClick: logoutUser },
        ]}
      />
      <Modal open={isOpen} onClose={closeModal} title="Change Password">
        <ChangePassword onClose={closeModal} userId={user.id} />
      </Modal>
    </>
  );
}

function ChangePassword({ onClose, userId }) {
  const dispatch = useDispatch();

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfPassword, setShowConfPassword] = useState(false);

  const {
    handleSubmit,
    register,
    setError,
    formState: { errors },
  } = useForm();

  const handlePassword = (data) => {
    // checks if the new password and the confirm password are the same
    if (data.newPassword !== data.confPassword) {
      setError("confPassword", { type: "custom", message: "The passwords do not match" });
    } else {
      changePassword(userId, data.oldPassword, data.newPassword)
        .then(() => onClose())
        .catch((error) => {
          dispatch(dispatchError(error));
        });
    }
  };

  const toggle = (id) => {
    switch (id) {
      case "oldPassword":
        setShowOldPassword(!showOldPassword);
        break;
      case "newPassword":
        setShowNewPassword(!showNewPassword);
        break;
      case "confPassword":
        setShowConfPassword(!showConfPassword);
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <form className="form flex flex-col" onSubmit={handleSubmit(handlePassword)}>
        <div className="modal__body text-black">
          <div className="relative">
            <div className="pb-3">
              <InputForm
                label="Old Password"
                id="oldPassword"
                type={showOldPassword === false ? "password" : "text"}
                classNameLabel="form__label"
                classNameInput="form__input"
                register={register}
                required={"This field is required"}
              />
              {errors.oldPassword && <div className="form__error">{errors.oldPassword.message}</div>}
            </div>
            <div className="absolute top-12 right-3">
              <ShowPassword showPassword={showOldPassword} onClick={() => toggle("oldPassword")} />
            </div>
          </div>
          <div className="relative">
            <div className="pb-3">
              <InputForm
                label="New Password"
                id="newPassword"
                type={showNewPassword === false ? "password" : "text"}
                classNameLabel="form__label"
                classNameInput="form__input"
                register={register}
                required={"This field is required"}
              />
              {errors.newPassword && <div className="form__error">{errors.newPassword.message}</div>}
            </div>
            <div className="absolute top-12 right-3">
              <ShowPassword showPassword={showNewPassword} onClick={() => toggle("newPassword")} />
            </div>
          </div>
          <div className="relative">
            <div className="pb-3">
              <InputForm
                label="Confirm Password"
                id="confPassword"
                type={showConfPassword === false ? "password" : "text"}
                classNameLabel="form__label"
                classNameInput="form__input"
                register={register}
                required={"This field is required"}
              />
              {errors.confPassword && <div className="form__error">{errors.confPassword.message}</div>}
            </div>
            <div className="absolute top-12 right-3">
              <ShowPassword showPassword={showConfPassword} onClick={() => toggle("confPassword")} />
            </div>
          </div>
        </div>

        <div className="modal__footer modal__border-t">
          <Button type="submit" typeClass="modal__btn-confirm" text="Confirm" />
          <Button type="button" typeClass="modal__btn-cancel" text="Cancel" onClick={onClose} />
        </div>
      </form>
    </div>
  );
}

ChangePassword.propTypes = {
  onClose: PropTypes.func,
  userId: PropTypes.string,
};
