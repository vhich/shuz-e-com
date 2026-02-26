import React, { useState } from "react";
import {
  Bell,
  User,
  Settings,
  LogOut,
  MessageSquare,
  UserPlus,
  Trash2,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import SidenavLinks from "./SidenavLinks";
import { useAppContext } from "../context/AppContent";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Loading from "./Loading";
import { toast } from "react-toastify";

const AdminNavbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [adminDeleteKey, setAdminDeleteKey] = useState("");
  const {
    handleAdminLogout,
    userData,
    isNewNotification,
    setLoading,
    api,
    backendUrl,
    setInviteAdmin,
  } = useAppContext();

  const location = useLocation();
  const navigate = useNavigate();

  // Define an array of paths where the cart should be HIDDEN
  const hideCartPaths = ["/admin/upload-product"];

  // Check if current path is in our "hide" list
  const shouldHideUploadBtn = hideCartPaths.includes(location.pathname);

  const openDeleteModal = () => {
    setIsDeleteModal(true);
  };
  const addAdminPage = () => {
    setInviteAdmin(true);
    navigate("/admin/add-admin");
  };
  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setLoading(true);
    const adminDeleteKeyText = import.meta.env.VITE_ADMIN_DELETE_PASS_KEY;
    if (
      adminDeleteKey === "" ||
      !adminDeleteKey ||
      adminDeleteKey !== adminDeleteKeyText
    ) {
      setTimeout(() => {
        toast.error("Please provide a valid delete key");
        setLoading(false);
      }, 500);
    } else {
      try {
        const { data } = await api.post(`${backendUrl}/admin/account/delete`);

        if (data.success) {
          toast.success(data.message);
          navigate("/");
        }
      } catch (error) {
        // toast(error);
        console.log(
          error?.response.data.message || "Something went wrong, try again",
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const menuItems = [
    {
      icon: <User size={16} />,
      label: "Profile Settings",
      display: `${userData?.role?.toLowerCase() === "super admin" ? "flex" : "hidden"}`,
    },
    {
      icon: <MessageSquare size={16} />,
      label: "Messages",
      display: `flex`,
    },
    {
      icon: <UserPlus size={16} />,
      label: "Add User",
      display: `${userData?.role.toLowerCase() === "super admin" ? "flex" : "hidden"}`,
      func: addAdminPage,
    },
    { divider: true },
    {
      icon: <LogOut size={16} />,
      label: "Log Out",
      color: "text-gray-700",
      func: handleAdminLogout,
      display: `flex`,
    },
    {
      icon: <Trash2 size={16} />,
      label: "Delete Account",
      color: "text-red-600",
      display: `${userData?.role?.toLowerCase() === "super admin" ? "flex" : "hidden"}`,
      func: openDeleteModal,
    },
  ];

  return (
    <>
      <nav className="bg-green-200 border-b border-gray-200 w-full z-30">
        <Loading />
        <div className="px-4 lg:px-6">
          <div className="flex items-center justify-between">
            {/* LEFT: Branding & Hamburger */}
            <div className="flex items-center justify-start gap-4">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden text-gray-600 hover:bg-gray-100 p-2 rounded-lg"
              >
                <Menu size={24} />
              </button>
              <NavLink
                to="/admin/dashboard"
                className="self-center text-xl! font-bold! hidden! md:inline-block! lg:inline-block! whitespace-nowrap text-gray-900"
              >
                Shuz<span className="text-gray-900">Panel</span>
              </NavLink>
            </div>

            {/* RIGHT: Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* add product button */}
              {!shouldHideUploadBtn && (
                <NavLink to={"/admin/upload-product"} className="pry-btn">
                  Add product
                </NavLink>
              )}

              {/* Notification Bell */}
              <button
                className="relative p-2 text-gray-500 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => navigate("/admin/notifications")}
              >
                <Bell size={20} />

                {/* The Red Dot - Only shows if there are unread notifications for THIS admin */}
                {isNewNotification && (
                  <span className="absolute top-2 right-2.5 block w-2.5 h-2.5 bg-red-500 border border-white rounded-full animate-pulse"></span>
                )}
              </button>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold uppercase">
                    {userData && `${userData.firstName[0]}`}
                  </div>
                  <ChevronDown
                    size={14}
                    className={`text-gray-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsDropdownOpen(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-20 py-1 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="flex flex-wrap items-center gap-1.5 text-sm font-semibold! text-gray-900 capitalize!">
                          {userData &&
                            ` ${userData.firstName}${" "}${userData.lastName}`}
                          <span
                            className={`${userData?.role?.toLowerCase() === "super admin" ? "bg-green-600 text-white" : "bg-gray-700 text-white"} px-1.5 py-0.5 capitalize text-xs! w-fit rounded-sm`}
                          >
                            {userData?.role}
                          </span>
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {userData && `${userData.username}`}
                        </p>
                      </div>
                      {menuItems.map((item, index) =>
                        item.divider ? (
                          <div
                            key={index}
                            className="border-t border-gray-100 my-1"
                          ></div>
                        ) : (
                          <button
                            key={index}
                            className={`w-full ${item.display} items-center gap-3 px-4 py-2.5 text-sm! hover:bg-gray-50 transition-colors ${item.color || "text-gray-700"}`}
                            onClick={item.func && item.func}
                          >
                            {item.icon}
                            {item.label}
                          </button>
                        ),
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE SIDEBAR OVERLAY (The Drawer) */}
        <div
          className={`fixed inset-0 z-40 transition-opacity duration-300 lg:hidden ${isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        >
          <div
            className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <div
            className={`absolute left-0 top-0 h-full w-64 bg-white shadow-xl transition-transform duration-300 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <span className="self-center text-xl! font-bold! whitespace-nowrap text-gray-900">
                Shuz<span className="text-gray-900">Panel</span>
              </span>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <SidenavLinks />
          </div>
        </div>
      </nav>

      {/* Delete modal */}
      {isDeleteModal && (
        <div className="w-full h-full bg-black/60 absolute top-0 left-0 z-50 grid place-items-center">
          <Loading />
          <div className="w-90% p-4 rounded-xl bg-white space-y-3">
            <h6>Delete Account</h6>
            <p className="text-sm! text-slate-500">
              Provide admin delete key to delete this account.
            </p>
            <form onSubmit={(e) => handleDeleteAccount(e)}>
              <input
                type="text"
                value={adminDeleteKey}
                onChange={(e) => setAdminDeleteKey(e.target.value)}
                className="w-full border border-gray-400 focus:ring focus:ring-gray-500 py-3 px-2 rounded-md"
              />
              <div className="flex flex-row-reverse gap-3 my-3">
                <button
                  className="bg-red-500 text-red-50 py-2 px-4 rounded-md"
                  type="submit"
                >
                  Delete account
                </button>
                <button
                  onClick={() => setIsDeleteModal(false)}
                  className="border border-slate-600! text-slate-700 py-2 px-3 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminNavbar;
