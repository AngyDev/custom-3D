import React from "react";
import { Link } from "react-router-dom";
import Button from "../../components/Button/Button";
import HeaderAuth from "../../components/HeaderAuth/HeaderAuth";

export default function Login() {
  const handleSubmit = () => {};

  return (
    <div className="bg-baseLight dark:bg-base h-screen flex items-center justify-center p-3">
      <div className="flex flex-col m-auto w-96">
        <HeaderAuth />
        <div className="auth-container">
          <h1 className="dark:text-black text-gray-300 text-4xl text-center">Login</h1>
          <div className="flex w-full mt-6">
            <form className="w-full" onSubmit={handleSubmit}>
              <div className="w-full mb-5">
                <label htmlFor="username" className="form__label-black">
                  Username
                </label>
                <input type="text" id="username" className="form__input" />
              </div>
              <div className="w-full mb-10">
                <label htmlFor="password" className="form__label-black">
                  Password
                </label>
                <input type="text" id="password" className="form__input" />
              </div>
              <div className="flex justify-between gap-4">
                <Button type="submit" typeClass="modal__btn-confirm w-full" text="Login" />
                <Button type="submit" typeClass="modal__btn-confirm w-full" text="Signup" />
              </div>
              {/* <Button type="submit" typeClass="modal__btn-confirm w-full" text="Login" />
            <p className="py-2">
              <span className="text-black dark:text-gray-300">Don't have an account yet? </span>
              <Link to="/signup" className="underline">
                <span className="font-bold">Sign up</span>
              </Link>
            </p> */}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
