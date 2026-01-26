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
import { NavLink, useLocation } from "react-router-dom";
import Loading from "./Loading";

const AdminNavbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { handleAdminLogout, userData } = useAppContext();

  const location = useLocation();

  // Define an array of paths where the cart should be HIDDEN
  const hideCartPaths = ["/admin/upload-product"];

  // Check if current path is in our "hide" list
  const shouldHideUploadBtn = hideCartPaths.includes(location.pathname);

  const menuItems = [
    { icon: <User size={16} />, label: "Profile Settings" },
    { icon: <MessageSquare size={16} />, label: "Messages" },
    { icon: <UserPlus size={16} />, label: "Add User" },
    { divider: true },
    {
      icon: <LogOut size={16} />,
      label: "Log Out",
      color: "text-gray-700",
      func: handleAdminLogout,
    },
    {
      icon: <Trash2 size={16} />,
      label: "Delete Account",
      color: "text-red-600",
    },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 w-full z-30">
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
            <span className="self-center text-xl! font-bold! hidden md:inline-block lg:inline-block whitespace-nowrap text-gray-900">
              Shuz<span className="text-gray-900">Panel</span>
            </span>
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
            <button className="relative p-2 text-gray-500 rounded-lg hover:bg-gray-100 transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2.5 block w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
            </button>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold uppercase!">
                  {userData &&
                    `${userData.firstName[0]}${userData.lastName[0]}`}
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
                      <p className="text-sm font-semibold! text-gray-900 capitalize!">
                        {userData &&
                          ` ${userData.firstName}${" "}${userData.lastName}`}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {userData && `${userData.email}`}
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
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm! hover:bg-gray-50 transition-colors ${item.color || "text-gray-700"}`}
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
  );
};

export default AdminNavbar;
