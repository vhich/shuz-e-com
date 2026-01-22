import React from "react";
import Navbar from "./Navbar";

const Jumbotron = ({ text }) => {
  return (
    <header className="shop_hero">
      <Navbar />
      <div className="container">
        <h1 className="mt-16 text-center">{text}</h1>
      </div>
    </header>
  );
};

export default Jumbotron;
