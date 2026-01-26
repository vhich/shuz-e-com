import React, { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
// import { toast } from "react-toastify";
// import axios from "axios";
import { useLocation } from "react-router-dom";

export const AppContent = createContext();

export const AppContextProvider = (props) => {
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL_NETWORK ||
    import.meta.env.VITE_BACKEND_URL_LOCAL;
  const [productId, setProductId] = useState();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(); //to get the product detail in the product page

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
    product,
    setProduct,
    backendUrl,
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
