import React, { useState, useEffect, useRef, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { assets, navLinks, userNavLinks } from "../assets/asset.js";
import { User, Search, ShoppingBag } from "lucide-react";
import { AppContent } from "../context/AppContent.jsx";

const Navbar2 = () => {
  const [isHome] = useState(window.location.pathname === "/");
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const { cartItems } = useContext(AppContent);
  const cartArray = Object.values(cartItems);

  const navigate = useNavigate();

  // Define an array of paths where the cart should be HIDDEN
  const hideCartPaths = ["/login", "/account/create-account", "/cart"];

  // Check if current path is in our "hide" list
  const shouldHideCart = hideCartPaths.includes(location.pathname);

  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If the click is NOT inside the dropdownRef, close the menu
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };

    // Add listener when component mounts
    document.addEventListener("mousedown", handleClickOutside);

    // CLEANUP: This is crucial! It removes the listener when the component is destroyed
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <nav className="py-4">
      <div className="container sm:hidden block">
        {/* Mobile Navbar can be implemented here */}
        <div className="top_nav flex justify-between items-center sm:hidden">
          <NavLink to="/" className="logo w-24">
            <img src={assets.logo} alt="logo image" />
          </NavLink>
          <div className="actions flex gap-4">
            <button className="search">
              <Search />
            </button>
            <button
              className="user"
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
            >
              <User />
              {/* user dropdown */}
              <ul
                // ref={dropdownRef}
                className={`user_dropdown ${isUserDropdownOpen ? "block" : "hidden"} bg-gray-100 px-4 rounded-md absolute top-16 right-0 shadow-lg z-50`}
              >
                {userNavLinks.map((link) => (
                  <li key={link.id} className="w-full text-left">
                    <NavLink
                      to={`/${link.id}`}
                      className="py-3 px-2.5 border-b border-gray-300"
                    >
                      {link.title}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </button>
            {!shouldHideCart && (
              <button
                className="cart relative"
                onClick={() => navigate("/cart")}
              >
                <ShoppingBag />
                <div className="cart_noft bg-red-600 rounded-full w-5 h-5 text-white flex justify-center items-center text-sm absolute -top-2 -right-3">
                  {cartArray && cartArray.length}
                </div>
              </button>
            )}
          </div>
        </div>

        <div className="bottom_nav bg-gray-100 rounded-md py-3 links flex justify-around mt-4">
          {navLinks.map((link) => (
            <NavLink
              key={link.id}
              to={link.id === "home" ? `/` : `/${link.id}`}
              className={`hover:text-green-700 transition-colors duration-300 ${isHome && link.id === "home" ? "text-green-700" : ""} ${window.location.pathname === `/${link.id}` ? "text-green-700" : ""}`}
            >
              {link.title}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar2;
