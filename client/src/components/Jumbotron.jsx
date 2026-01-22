import React from "react";
import PropTypes from "prop-types";
import Navbar2 from "./Navbar2";

const Jumbotron = ({ text }) => {
  return (
    <header className="shop_hero">
      <Navbar2 />
      <div className="container">
        <h1 className="mt-16 text-center">{text}</h1>
      </div>
    </header>
  );
};

Jumbotron.propTypes = {
  text: PropTypes.string.isRequired,
};

export default Jumbotron;
