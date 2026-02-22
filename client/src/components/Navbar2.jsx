import React, { useState, useEffect, useRef, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { assets, navLinks, userNavLinks } from "../assets/asset.js";
import { User, Search, ShoppingBag } from "lucide-react";
import { AppContent } from "../context/AppContent.jsx";

const Navbar2 = () => {
  const [isHome] = useState(window.location.pathname === "/");
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const { cartItems, isLoggedIn, handleLogout, userData, setIsSearchOpen } =
    useContext(AppContent);
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
            <button onClick={() => setIsSearchOpen(true)} className={`search`}>
              <Search />
            </button>
            <button
              className="user"
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
            >
              <div className="flex items-center">
                {!isLoggedIn ? (
                  <User />
                ) : (
                  <>
                    {userData?.image ? (
                      <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-white shadow-md">
                        <img
                          src={userData.image}
                          alt="user profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-9 w-9 bg-green-600 rounded-full overflow-hidden border-2 border-white shadow-md">
                        <h6 className="text-white">{userData.name[0]}</h6>
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
