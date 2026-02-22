import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import { ToastContainer } from "react-toastify";
import BlockageUI from "../components/BlockageUI";

const MainLayout = () => {
  return (
    <>
      <BlockageUI />
      <ToastContainer />
      <Outlet />
      <Footer />
    </>
  );
};

export default MainLayout;
