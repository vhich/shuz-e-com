import React from "react";
import SidenavLinks from "./SidenavLinks";

const SideNav = () => {
  return (
    <aside className="h-screen bg-gray-100 hidden lg:block">
      <SidenavLinks />
    </aside>
  );
};

export default SideNav;
