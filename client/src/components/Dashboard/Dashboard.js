import React from "react";
import PropTypes from "prop-types";
import Header from "./Header/Header";
import Projects from "./Projects/Projects";
import io from "socket.io-client";
import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

const ENDPOINT = process.env.REACT_APP_ENDPOINT;

export default function Dashboard({ archived }) {
  const { user } = useAuth();

  useEffect(() => {
    const socketId = localStorage.getItem("socketId");
    if (socketId === null) {
      const socket = io(ENDPOINT, {
        closeOnBeforeunload: false, // to prevent the killed connection with the server when I use the beforeunload eventListener
      });

      socket.on("socketId", (socketId) => {
        localStorage.setItem("socketId", socketId);
      });

      // socket.on("connect", () => {
      //   console.log("connected to server");
      // });

      socket.emit("online", user.id, (error) => {
        console.log("online", error);
      });
    }
  }, [user]);

  return (
    <>
      <Header archived={archived} />
      <Projects archived={archived} />
    </>
  );
}

Dashboard.propTypes = {
  archived: PropTypes.bool,
};
