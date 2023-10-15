import React from "react";
import PropTypes from "prop-types";
import Header from "./Header/Header";
import Projects from "./Projects/Projects";
import io from "socket.io-client";
import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

const ENDPOINT = import.meta.env.VITE_APP_ENDPOINT;

/**
 * The Dashboard component is the component that contains the list of the project or the list
 * of the archived projects. It is possible change from one page to another via a specified button.
 * @param {Boolean} archived Indicates if the page is the list of the projects of the archived projects
 * @returns The page of the list of projects
 */
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
