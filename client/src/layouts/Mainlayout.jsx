import React, { useEffect } from "react";
import Navbar from "./../components/Navbar";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import ToTopBtn from "../components/toTopBtn";

const Mainlayout = () => {
  return (
    <>
      {/* <Navbar /> */}
      <ToTopBtn />
      <Outlet />
      <Footer />
    </>
  );
};

export default Mainlayout;
