import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AppContext } from "./AppContent";
import { io } from "socket.io-client";
import { assets } from "../assets/assets";

export const AppContextProvider = (props) => {
  const backendUrl = `http://${window.location.hostname}:4000/api`;
  const socketBackendUrl =
    window.location.hostname === "localhost"
      ? "http://localhost:4000"
      : `${window.location.origin}`; // Or simply window.location.origin if they share a domain

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [disableForm, setDisableForm] = useState(false);
  // 2. Global Admin States
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isNewNotification, setIsNewNotification] = useState(false);
  // const [currentProduct, setCurrentProduct] = useState(null);

  const navigate = useNavigate();
  const currentAdminId = userData?.id;
  const hasUnread = notifications.some((n) => {
    const readBy = n.readBy || [];
    return !readBy.some((r) => r.adminId === currentAdminId);
  });

  useEffect(() => {
    if (hasUnread) {
      setIsNewNotification(true);
    } else {
      setIsNewNotification(false);
    }
  }, [hasUnread, notifications]);

  useEffect(() => {
    if (!isLoggedIn) {
      setUserData(null);
    }
    if (isLoggedIn) {
      const socket = io(socketBackendUrl, {
        withCredentials: true,
        transports: ["websocket", "polling"], // Force these to ensure compatibility
      });
      const fetchNotifications = async () => {
        // Join the admin room
        socket.emit("joinAdminRoom");
        socket.on("newNotification", (notif) => {
          toast.info(`🔔 ${notif.title}: \n${notif.content}`);
          setNotifications((prev) => [notif, ...prev]);
          console.log("New Notif ReadBy:", notif.readBy);
          setIsNewNotification(true);

          const audio = new Audio(assets.noftSound);

          // Play with a more robust promise handler
          const playPromise = audio.play();

          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                console.log("Audio playing successfully");
              })
              .catch((error) => {
                // This usually logs: "The play() request was interrupted by a call to pause()"
                // or "User didn't interact with the document first"
                console.log(
                  "Playback prevented. Click anywhere on the page to enable sound." +
                    error,
                );
              });
          }
        });
      };
      fetchNotifications();

      return () => socket.off("newNotification");
    }
  }, [isLoggedIn, socketBackendUrl]);

  const fetchAllNotifications = useCallback(async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/admin/notifications`, {
        withCredentials: true,
      });
      if (data.success) {
        setNotifications(data.notifications);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }, [backendUrl]);
  useEffect(() => {
    if (isLoggedIn) {
      fetchAllNotifications();
    }
  }, [isLoggedIn, fetchAllNotifications]);

  const handleReadNotification = async (id) => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/admin/notifications/read/${id}`,
        {
          withCredentials: true,
          adminId: currentAdminId, // Pass the admin ID to mark as read for this specific admin
        },
      );
      if (data.success) {
        // Update local state so the dot disappears instantly
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? data.notification : n)),
        );
        if (
          data.notification.readBy.some((r) => r.adminId === currentAdminId)
        ) {
          setIsNewNotification(false);
        }
      }
    } catch (err) {
      console.error("Error marking read", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllProducts = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/shuz/products`);
      if (data.success) {
        // Reverse to show the most recently uploaded products first
        setProducts(data.data.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Admin Fetch Error:", error);
      alert(
        "Failed to load inventory.\nPlease check internet connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  }, [backendUrl]);

  const handleAdminCreateAccount = async (formData) => {
    try {
      // Optional: Call backend logout to clear the cookie
      const { data } = await axios.post(
        `${backendUrl}/admin/register`,
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
        `${backendUrl}/admin/login`,
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
      }
    } catch (err) {
      console.error("Login failed", err);
      alert(err?.response?.data?.message);
      setDisableForm(false);
      setLoading(false);
    }
  };

  const handleAdminLogout = async () => {
    setLoading(true);
    try {
      // Optional: Call backend logout to clear the cookie
      const { data } = await axios.post(
        `${backendUrl}/admin/logout`,
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
        `${backendUrl}/admin/me?t=${new Date().getTime()}`,
        {
          withCredentials: true,
        },
      );

      if (data.success) {
        setUserData(() => data.admin);
        setIsLoggedIn(true);
        navigate("/admin/dashboard");
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

  // Delete logic remains identical
  const deleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      setLoading(true);
      try {
        const { data } = await axios.delete(
          `${backendUrl}/shuz/products/${id}`,
        );
        if (data.success) {
          toast.success("Product removed");
          setLoading(false);
          navigate("/admin/products");
        }
      } catch (error) {
        alert(
          "Failed to delete product.\nPlease check internet connection and try again.",
        );
        console.log(error);
      }
    }
  };

  useEffect(() => {
    const initBuyer = async () => {
      await getAdminAuthState();
    };
    initBuyer();
  }, [getAdminAuthState]);

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
    products,
    setProducts,
    fetchAllProducts,
    editMode,
    setEditMode,
    deleteProduct,
    fetchAllNotifications,
    handleReadNotification,
    setNotifications,
    notifications,
    isNewNotification,
    hasUnread,
  };

  return (
    <AppContext.Provider value={globalState}>
      {props.children}
    </AppContext.Provider>
  );
};
