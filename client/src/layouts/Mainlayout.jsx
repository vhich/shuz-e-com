import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import ToTopBtn from "../components/ToTopBtn";
import Loading from "../components/Loading";
import { ToastContainer } from "react-toastify";
import BlockageUI from "../components/BlockageUI";
import { AppContent } from "../context/AppContent";
import SearchModal from "../components/SearchModal";

const Mainlayout = () => {
  const { isSearchOpen, setIsSearchOpen, allProduct } =
    React.useContext(AppContent);
  return (
    <>
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={allProduct}
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
