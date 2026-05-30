import React from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import BlockageUI from "../components/BlockageUI";
import Footer from "../components/Footer";
import Loading from "../components/Loading";
import SearchModal from "../components/SearchModal";
import ToTopBtn from "../components/ToTopBtn";
import { AppContent } from "../context/AppContent";

const Mainlayout = () => {
  const { isSearchOpen, setIsSearchOpen } = React.useContext(AppContent);
  return (
    <>
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
      <BlockageUI />
      <ToastContainer />
      <ToTopBtn />
      <Loading />
      <Outlet />
      <Footer />
    </>
  );
};

export default Mainlayout;
