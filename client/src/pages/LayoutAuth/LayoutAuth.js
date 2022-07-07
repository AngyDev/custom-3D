import React from "react";
import PropTypes from "prop-types";
import HeaderAuth from "../../components/HeaderAuth/HeaderAuth";

export default function LayoutAuth({ children, title }) {
  return (
    <div className="bg-baseLight dark:bg-base h-screen flex items-center justify-center p-3">
      <div className="flex flex-col m-auto w-96">
        <HeaderAuth />
        <div className="auth-container">
          <h1 className="dark:text-black text-gray-300 text-4xl text-center">{title}</h1>
          <div className="flex w-full mt-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

LayoutAuth.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};
