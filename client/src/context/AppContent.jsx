import React, { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
// import { toast } from "react-toastify";
import axios from "axios";
import { useLocation } from "react-router-dom";

export const AppContent = createContext();

export const AppContextProvider = (props) => {
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL_NETWORK ||
    import.meta.env.VITE_BACKEND_URL_LOCAL;
  const [newProducts, setNewProducts] = useState(null);
  const [bestSellerProducts, setBestSellerProducts] = useState([]);
  const [productId, setProductId] = useState();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(); //to get the product detail in the product page
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("shuzCart");
    return savedCart ? JSON.parse(savedCart) : {};
  });

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem("shuzCart", JSON.stringify(cartItems));
  }, [cartItems]);

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
    const fetchNewProducts = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/shuz/products`);

        if (data?.success) {
          // 2. Update state
          const products = data.data;

          setNewProducts(products.splice(0, 4));
          const filteredBestSellers = products.filter((p) => p.price > 500);
          setBestSellerProducts(filteredBestSellers);
        }
      } catch (error) {
        console.error("Error fetching products", error);
        // alert("Error fetching products");
        // window.location.href = "/";
      }
    };

    fetchNewProducts();
    return undefined;
  }, [backendUrl]);

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
    newProducts,
    setNewProducts,
    bestSellerProducts,
    backendUrl,
    cartItems,
    setCartItems,
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
