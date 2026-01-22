import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import ToTopBtn from "../components/toTopBtn";

const Mainlayout = () => {
  return (
    <>
      <ToTopBtn />
      <Outlet />
      <Footer />
    </>
  );
};

export default Mainlayout;
