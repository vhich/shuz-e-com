import React from "react";
import { NavLink } from "react-router-dom";

const SidenavLinks = () => {
  return (
    <div className="pl-4 pt-6">
      {/* Add your Sidebar Links here */}
      <NavLink
        to={"/dashboard"}
        className="w-full text-left px-2 py-4 border-b border-gray-300 hover:bg-gray-50 rounded text-gray-700 font-medium!"
      >
        Dashboard
      </NavLink>
      <NavLink
        to={"/orders"}
        className="w-full text-left px-2 py-4 border-b border-gray-300 hover:bg-gray-50 rounded text-gray-700 font-medium!"
      >
        Orders
      </NavLink>
      <NavLink
        to={"/customers"}
        className="w-full text-left px-2 py-4 border-b border-gray-300 hover:bg-gray-50 rounded text-gray-700 font-medium!"
      >
        Customers
      </NavLink>
    </div>
  );
};

export default SidenavLinks;
