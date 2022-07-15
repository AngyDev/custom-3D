import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import InputForm from "../../components/atoms/InputForm/InputForm";
import ShowPassword from "../../components/atoms/ShowPassword/ShowPassword";
import Button from "../../components/Button/Button";
import { useAuth } from "../../context/AuthContext";
import { dispatchError } from "../../features/error/errorSlice";
import { registerUser } from "../../services/api";
import LayoutAuth from "../LayoutAuth/LayoutAuth";

export default function Register() {
  const { login } = useAuth();
  const history = useHistory();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfPassword, setShowConfPassword] = useState(false);

  const {
    handleSubmit,
    register,
    setError,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    console.log(data);
    if (data.password !== data.confPassword) {
      setError("confPassword", { type: "custom", message: "The passwords do not match" });
    } else {
      registerUser(data)
        .then((response) => {
          login(response.data);
          history.push("/dashboard");
        })
        .catch((error) => {
          dispatch(dispatchError(error));
        });
    }
  };

  const toggle = (id) => {
    switch (id) {
      case "password":
        setShowPassword(!showPassword);
        break;
      case "confPassword":
        setShowConfPassword(!showConfPassword);
        break;
      default:
        break;
    }
  };

  return (
    <LayoutAuth title="Register">
      <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full mb-3">
          <InputForm
            label="First name"
            id="firstName"
            type="text"
            classNameLabel="form__label-black"
            classNameInput="form__input"
            register={register}
            required={"This field is required"}
          />
          {errors.firstName && <div className="form__error">{errors.firstName.message}</div>}
        </div>
        <div className="w-full mb-3">
          <InputForm
            label="Last name"
            id="lastName"
            type="text"
            classNameLabel="form__label-black"
            classNameInput="form__input"
            register={register}
            required={"This field is required"}
          />
          {errors.lastName && <div className="form__error">{errors.lastName.message}</div>}
        </div>
        <div className="w-full mb-3">
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
          <div className="w-full mb-3">
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
            <ShowPassword showPassword={showPassword} onClick={() => toggle("password")} />
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
          <Button type="submit" typeClass="modal__btn-confirm w-full" text="Create Account" />
          <Link to="/" className="w-full no-underline">
            <Button type="button" typeClass="modal__btn-confirm w-full" text="Login" />
          </Link>
        </div>
      </form>
    </LayoutAuth>
  );
}
