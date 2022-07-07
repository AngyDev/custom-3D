import React from "react";
// import { Link } from "react-router-dom";
import Button from "../../components/Button/Button";
import { useForm } from "react-hook-form";
import InputForm from "../../components/atoms/InputForm/InputForm";
import LayoutAuth from "../LayoutAuth/LayoutAuth";

export default function Login() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
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
          {errors.username && <div className="form__error">{errors.username.message}</div>}
        </div>
        <div className="w-full mb-10">
          <InputForm
            label="Password"
            id="password"
            type="password"
            classNameLabel="form__label-black"
            classNameInput="form__input"
            register={register}
            required={"This field is required"}
          />
          {errors.password && <div className="form__error">{errors.password.message}</div>}
        </div>
        <div className="flex justify-between gap-4">
          <Button type="submit" typeClass="modal__btn-confirm w-full" text="Login" />
          {/* <Link to="/register" className="w-full no-underline"> */}
          <Button type="button" typeClass="modal__btn-confirm w-full" text="Signup" />
          {/* </Link> */}
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
