import React from "react";
import { footerLinks, assets } from "../assets/asset";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-black text-gray-300 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div>
              <NavLink to="/">
                <img
                  src={assets.logo_white}
                  alt="Brand Logo"
                  className="h-10 w-auto"
                />
              </NavLink>
            </div>
            <p className="text-sm leading-relaxed">
              Elevating your shopping experience with the best products and
              unmatched customer service.
            </p>
          </div>

          {/* Dynamic Link Sections */}
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h6 className="text-white font-semibold mb-6 uppercase tracking-wider text-xl!">
                {section.title}
              </h6>
              <ul className="space-y-4">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                      className="hover:text-green-600 transition-colors duration-200 text-sm"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center text-xs">
          <p>© {new Date().getFullYear()} Brand Inc. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <span className="cursor-pointer hover:text-white">Twitter</span>
            <span className="cursor-pointer hover:text-white">Instagram</span>
            <span className="cursor-pointer hover:text-white">Facebook</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
