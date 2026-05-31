import PropTypes from "prop-types";
import { createContext, useEffect, useState } from "react";
// import { toast } from "react-toastify";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../config/axiosConfig";

export const AppContent = createContext();

export const AppContextProvider = (props) => {
  // const backendUrl =
  //   import.meta.env.VITE_BACKEND_URL_NETWORK || "http://localhost:4000/api";
  const backendUrl = "http://localhost:4000/api";
  const [isOpen, setIsOpen] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [newProducts, setNewProducts] = useState(null);
  const [bestSellerProducts, setBestSellerProducts] = useState(null);
  const [productId, setProductId] = useState();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(); //to get the product detail in the product page
  const [allCategories, setAllCategories] = useState([]);
  const [token, setToken] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("shuzCart");
    return savedCart ? JSON.parse(savedCart) : {};
  });

  const navigate = useNavigate();
  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem("shuzCart", JSON.stringify(cartItems));
  }, [cartItems]);

  const verifyClient = async () => {
    try {
      const response = await api.get(backendUrl + "/client/check-auth");

      if (response.data.success) {
        const dbCart = response.data.client.cartData || {};
        setUserData(response.data.client);
        setIsLoggedIn(true);

        // THE SAFE MERGE
        setCartItems((prevGuestItems) => {
          return { ...dbCart, ...prevGuestItems };
        });
      }
    } catch (error) {
      setIsLoggedIn(false);
      console.log(error);
    }
  };

  useEffect(() => {
    verifyClient();
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    try {
      // withCredentials: true is vital to send the cookie
      const response = await api.post(`${backendUrl}/client/logout`, {});
      if (response.data.success) {
        setIsLoggedIn(false);
        setUserData(null); // Clear the object!
        toast.success(response.data.message);
        navigate("/");
      }
    } catch (error) {
      toast.error(error?.data?.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const { pathname } = useLocation();

  const fetchHomeData = async () => {
    setLoading(true);
    try {
      // Run requests in parallel to speed up home screen loading times!
      const [newArrivalsRes, bestSellersRes] = await Promise.all([
        axios.get(`${backendUrl}/me/shuz/products?type=new-arrivals`),
        axios.get(`${backendUrl}/me/shuz/products?type=best-sellers`),
      ]);

      setNewProducts(newArrivalsRes.data.data); // Array of exactly 4 items
      setBestSellerProducts(bestSellersRes.data.data); // Array of exactly 4 items
    } catch (error) {
      console.error("Error fetching homepage sections:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  const globalState = {
    // Define any global state or functions here
    setUserData,
    setProductId,
    setLoading,
    setNewProducts,
    setProduct,
    setAllCategories,
    setBestSellerProducts,
    setCartItems,
    setToken,
    setIsLoggedIn,
    setIsOpen,
    setOrderSuccess,
    setIsSearchOpen,
    fetchHomeData,
    productId,
    loading,
    product,
    newProducts,
    bestSellerProducts,
    allCategories,
    backendUrl,
    cartItems,
    token,
    userData,
    isLoggedIn,
    isOpen,
    orderSuccess,
    api,
    isSearchOpen,

    handleLogout,
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
