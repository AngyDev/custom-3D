import React, { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

const UserContext = createContext(null);

// const defaultUser = {
//   id: "d27db05e-fb3f-4942-a517-59fefbd97937",
//   firstName: "Angela",
//   lastName: "Busato",
//   email: "bsuato.angela@gmail.com",
//   role: "engeener",
// };

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (user) => {
    setUser(user);
    localStorage.setItem("user", user.id);
    localStorage.removeItem("socketId");
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("socketId");
    setUser(null);
  };

  return <UserContext.Provider value={{ user, login, logout }}>{children}</UserContext.Provider>;
};

export const useAuth = () => {
  return useContext(UserContext);
};

AuthContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
