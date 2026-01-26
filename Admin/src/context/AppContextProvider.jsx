import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AppContext } from "./AppContent";

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [disableForm, setDisableForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleAdminCreateAccount = async (formData) => {
    try {
      // Optional: Call backend logout to clear the cookie
      const { data } = await axios.post(
        `${backendUrl}/register`,
        { ...formData },
        {
          withCredentials: true,
        },
      );
      if (data.success) {
        toast.success(data.message);
        setIsLoggedIn(true);
        navigate("/");
        setDisableForm(false);
        setLoading(false);
      } else {
        alert(data.message);
        setDisableForm(false);
        setLoading(false);
      }
    } catch (err) {
      console.error("Login failed", err);
      alert(err?.response?.data.message);
      setDisableForm(false);
      setLoading(false);
    }
  };

  const handleAdminLogin = async (email, password) => {
    try {
      // Optional: Call backend logout to clear the cookie
      const { data } = await axios.post(
        `${backendUrl}/login`,
        { email, password },
        {
          withCredentials: true,
        },
      );
      if (data.success) {
        toast.success(data.message);
        setIsLoggedIn(true);
        window.location.href = "/admin/dashboard";
        setDisableForm(false);
        setLoading(false);
      } else {
        alert(data.message);
        setDisableForm(false);
        setLoading(false);
      }
    } catch (err) {
      console.error("Login failed", err);
      alert(err?.response?.data.message);
      setDisableForm(false);
      setLoading(false);
    }
  };

  const handleAdminLogout = async () => {
    setLoading(true);
    try {
      // Optional: Call backend logout to clear the cookie
      const { data } = await axios.post(
        `${backendUrl}/logout`,
        {},
        {
          withCredentials: true,
        },
      );
      if (data.success) {
        setLoading(false);
        toast.success(data.message);
        setUserData(null);
        setIsLoggedIn(null);
        navigate("/");
      }
    } catch (err) {
      console.error("Logout failed", err);
      alert("something went wrong!");
      setLoading(false);
    }
  };

  const getAdminAuthState = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/me?t=${new Date().getTime()}`,
        {
          withCredentials: true,
        },
      );

      if (data.success) {
        setUserData(() => data.admin);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.log("Status Code:", error?.response?.status);
      setUserData(null);
      setIsLoggedIn(null);
      if (error?.response && error.response.status === 429) {
        const expiryTime = Date.now() + 3 * 60 * 1000;
        localStorage.setItem("login_lockout", expiryTime);
        navigate("/account/too-many-attempts");
        setUserData(null);
        setIsLoggedIn(null);
      } else {
        // 4. Handle other errors (like "Email already in use")
        const message = error.response?.data?.message || error;
        console.error("Error!", message);
        setUserData(null);
        setIsLoggedIn(null);
      }
    }
  }, [navigate, backendUrl]);

  useEffect(() => {
    const initBuyer = async () => {
      await getAdminAuthState();
    };
    initBuyer();
  }, [getAdminAuthState]);

  useEffect(() => {
    const onPageShow = (event) => {
      if (event.persisted) {
        // Page was loaded from bfcache (Back button)
        // Force a re-check of auth status
        window.location.reload();
      }
    };

    window.addEventListener("load", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  const globalState = {
    // Define any global state or functions here
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    handleAdminCreateAccount,
    handleAdminLogin,
    handleAdminLogout,
    disableForm,
    setDisableForm,
    loading,
    setLoading,
  };

  return (
    <AppContext.Provider value={globalState}>
      {props.children}
    </AppContext.Provider>
  );
};
