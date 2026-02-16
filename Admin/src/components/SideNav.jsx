import React from "react";
import SidenavLinks from "./SidenavLinks";

const SideNav = () => {
  return (
    <aside className="sticky top-0 h-screen bg-green-100 hidden lg:block overflow-y-auto">
      <SidenavLinks />
    </aside>
  );
};

export default SideNav;
