import React from "react";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  console.log("user", user);

  if (user === null) {
    return <Redirect push to="/" />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
