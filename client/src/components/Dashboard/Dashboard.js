import React from "react";
import PropTypes from "prop-types";
import Header from "./Header/Header";
import Projects from "./Projects/Projects";

export default function Dashboard({ archived }) {
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
