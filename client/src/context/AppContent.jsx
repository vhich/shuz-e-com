import { createContext, useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

export const AppContent = createContext();

export const AppContextProvider = (props) => {
  //   const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [productId, setProductId] = useState();

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  const globalState = {
    // Define any global state or functions here
    productId,
    setProductId,
  };

  return (
    <AppContent.Provider value={globalState}>
      {props.children}
    </AppContent.Provider>
  );
};
