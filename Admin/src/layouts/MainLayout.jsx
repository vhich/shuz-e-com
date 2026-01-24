import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import AdminNavbar from "../components/AdminNavbar";

const MainLayout = () => {
  return (
    <>
      <Outlet />
      {/* <Footer /> */}
    </>
  );
};

export default MainLayout;
