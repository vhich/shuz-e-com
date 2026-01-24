import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import ToTopBtn from "../components/toTopBtn";
import Loading from "../components/Loading";

const Mainlayout = () => {
  return (
    <>
      <ToTopBtn />
      <Loading />
      <Outlet />
      <Footer />
    </>
  );
};

export default Mainlayout;
