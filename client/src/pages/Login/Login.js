import React, { useState } from "react";
import Button from "../../components/Button/Button";
import { useForm } from "react-hook-form";
import InputForm from "../../components/atoms/InputForm/InputForm";
import LayoutAuth from "../LayoutAuth/LayoutAuth";
import { Link, useHistory } from "react-router-dom";
import { getUser } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useDispatch } from "react-redux";
import { dispatchError } from "../../features/error/errorSlice";
import ShowPassword from "../../components/atoms/ShowPassword/ShowPassword";

export default function Login() {
  const { login } = useAuth();
  const history = useHistory();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    getUser(data)
      .then((response) => {
        login(response.data[0]);
        history.push("/dashboard");
      })
      .catch((error) => {
        dispatch(dispatchError(error));
      });
  };

  const toggle = () => {
    setShowPassword(!showPassword);
  };

  return (
    <LayoutAuth title="Login">
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
          <div className="w-full mb-10">
            <InputForm
              label="Password"
              id="password"
              type={showPassword === false ? "password" : "text"}
              classNameLabel="form__label-black"
              classNameInput="form__input"
              register={register}
              required={"This field is required"}
            />
            {errors.password && <div className="form__error">{errors.password.message}</div>}
          </div>
          <div className="absolute top-12 right-3">
            <ShowPassword showPassword={showPassword} onClick={toggle} />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <Button type="submit" typeClass="modal__btn-confirm w-full" text="Login" />
          <Link to="/register" className="w-full no-underline">
            <Button type="button" typeClass="modal__btn-confirm w-full" text="Register" />
          </Link>
        </div>
        {/* <Button type="submit" typeClass="modal__btn-confirm w-full" text="Login" />
            <p className="py-2">
              <span className="text-black dark:text-gray-300">Don't have an account yet? </span>
              <Link to="/signup" className="underline">
                <span className="font-bold">Sign up</span>
              </Link>
            </p> */}
      </form>
    </LayoutAuth>
  );
}
