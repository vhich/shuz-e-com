import React, { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
// import { toast } from "react-toastify";
// import axios from "axios";
import { useLocation } from "react-router-dom";

export const AppContent = createContext();

export const AppContextProvider = (props) => {
  //   const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [productId, setProductId] = useState();
  const [loading, setLoading] = useState(true);

  const { pathname } = useLocation();

  useEffect(() => {
    const onPageLoad = () => {
      setLoading(false);
      console.log("Page fully loaded");
    };

    if (document.readyState === "complete") {
      onPageLoad();
    } else {
      window.addEventListener("load", onPageLoad);
      return () => window.removeEventListener("load", onPageLoad);
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  const globalState = {
    // Define any global state or functions here
    productId,
    setProductId,
    setLoading,
    loading,
  };

  return (
    <AppContent.Provider value={globalState}>
      {props.children}
    </AppContent.Provider>
  );
};

AppContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
