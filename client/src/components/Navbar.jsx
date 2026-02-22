import React, { useState, useEffect, useRef, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { assets, navLinks, userNavLinks } from "../assets/asset.js";
import { ShoppingBag, User, Search } from "lucide-react";
import { useLocation } from "react-router-dom";
import { AppContent } from "../context/AppContent.jsx";
import Navbar2 from "./Navbar2.jsx";

const Navbar = () => {
  const [isHome] = useState(window.location.pathname === "/");
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const { cartItems, isLoggedIn, userData, handleLogout, setIsSearchOpen } =
    useContext(AppContent);

  const navigate = useNavigate();
  const location = useLocation();
  const cartArray = Object.values(cartItems);

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
    <>
      <nav className="py-4 sm:flex hidden">
        <div className="container flex justify-between items-center border-b-2 border-gray-200 pb-4">
          <NavLink to="/" className="logo w-32">
            <img src={assets.logo} alt="logo image" />
          </NavLink>
          <div className="links flex gap-6">
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
          <div className="actions flex gap-4">
            <button onClick={() => setIsSearchOpen(true)} className={`search`}>
              <Search />
            </button>
            <button
              className={`user relative`}
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              onMouseEnter={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              onMouseLeave={() => setIsUserDropdownOpen(false)}
            >
              <div className="flex items-center">
                {!isLoggedIn ? (
                  <User />
                ) : (
                  <>
                    {userData?.image && userData.image !== "" ? (
                      <div className="h-9 w-9 rounded-full overflow-hidden border-2 border-white shadow-md">
                        <img
                          src={userData.image}
                          alt="user profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-9 w-9 grid place-items-center bg-green-600 rounded-full overflow-hidden border-2 border-white shadow-md">
                        <b className="text-white text-xl">{userData.name[0]}</b>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* user dropdown */}
              <ul
                ref={dropdownRef}
                className={`user_dropdown ${isUserDropdownOpen ? "block" : "hidden"} bg-white w-60 rounded-md absolute top-full -right-4/5 shadow-lg overflow-hidden z-48`}
              >
                {isLoggedIn && (
                  <>
                    <div className="bg-green-100 py-2 px-4">
                      <small className="block! text-left!">
                        {userData && userData.email}
                      </small>
                      <small className="block! text-left! mt-2 text-slate-500">
                        {userData && userData.name}
                      </small>
                    </div>
                    {isLoggedIn && (
                      <li className="w-full">
                        <NavLink
                          to={`/orders`}
                          className="py-3 border-b border-gray-300 hover:bg-gray-200"
                        >
                          My Orders
                        </NavLink>
                      </li>
                    )}
                  </>
                )}
                {userNavLinks.map((link) => (
                  <li key={link.id} className="w-full">
                    <NavLink
                      to={`/${link.id}`}
                      className="py-3 border-b border-gray-300 hover:bg-gray-200"
                    >
                      {link.title}
                    </NavLink>
                  </li>
                ))}
                {isLoggedIn ? (
                  <li
                    onClick={handleLogout}
                    className="logout py-3 border-b border-gray-300 bg-slate-100 text-slate-700"
                  >
                    Logout
                  </li>
                ) : (
                  <li className="w-full">
                    <NavLink
                      to={`/login`}
                      className="py-3 border-b border-gray-300 hover:bg-gray-200"
                    >
                      Login
                    </NavLink>
                  </li>
                )}
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
      </nav>
      <Navbar2 />
    </>
  );
};

export default Navbar;
