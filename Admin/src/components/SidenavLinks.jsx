import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  PackageSearch,
} from "lucide-react";

const sideNavLinks = [
  {
    to: "/admin/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard size={16} />,
  },
  {
    to: "/admin/products",
    label: "Products",
    icon: <PackageSearch size={16} />,
  },
  { to: "/admin/orders", label: "Orders", icon: <ClipboardList size={16} /> },
  { to: "/admin/customers", label: "Customers", icon: <Users size={16} /> },
];

const SidenavLinks = () => {
  return (
    <div className="pl-4 pt-6">
      {/* Add your Sidebar Links here */}
      {sideNavLinks.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `flex! items-center gap-2 px-4 py-4 mb-2 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? "bg-green-200 text-green-900"
                : "text-gray-700 hover:bg-green-200"
            }`
          }
        >
          {link.icon}
          {link.label}
        </NavLink>
      ))}
    </div>
  );
};

export default SidenavLinks;
