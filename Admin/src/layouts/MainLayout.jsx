import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import AdminNavbar from "../components/AdminNavbar";
import { ToastContainer } from "react-toastify";

const MainLayout = () => {
  return (
    <>
      <ToastContainer />
      <Outlet />
      <Footer />
    </>
  );
};

export default MainLayout;
