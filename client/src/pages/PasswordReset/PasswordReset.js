import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import Button from "../../components/atoms/Button/Button";
import InputForm from "../../components/atoms/InputForm/InputForm";
import ShowPassword from "../../components/atoms/ShowPassword/ShowPassword";
import LayoutAuth from "../LayoutAuth/LayoutAuth";
import { dispatchError } from "../../features/error/errorSlice";
import { resetPassword } from "../../services/api";
import { useHistory } from "react-router-dom";

export default function PasswordReset() {
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const history = useHistory();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfPassword, setShowConfPassword] = useState(false);

  const onSubmit = async (data) => {
    if (data.newPassword !== data.confPassword) {
      setError("confPassword", { type: "custom", message: "The passwords do not match" });
    } else {
      resetPassword(data.email, data.newPassword)
        .then(history.push("/"))
        .catch((error) => {
          dispatch(dispatchError(error));
        });
    }
  };

  const toggle = (id) => {
    switch (id) {
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
    <LayoutAuth title="Reset Password">
      <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full mb-5">
          <InputForm
            label="Email"
            id="email"
            type="email"
            classNameLabel="form__label-black"
            classNameInput="form__input"
            register={register}
            required={"This field is required"}
          />
          {errors.email && <div className="form__error">{errors.email.message}</div>}
        </div>
        <div className="relative">
          <div className="pb-3">
            <InputForm
              label="New Password"
              id="newPassword"
              type={showNewPassword === false ? "password" : "text"}
              classNameLabel="form__label-black"
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
          <div className="w-full mb-8">
            <InputForm
              label="Confirm Password"
              id="confPassword"
              type={showConfPassword === false ? "password" : "text"}
              classNameLabel="form__label-black"
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
        <div className="flex flex-col gap-4">
          <Button type="submit" typeClass="modal__btn-confirm w-full" text="Save" />
        </div>
      </form>
    </LayoutAuth>
  );
}
