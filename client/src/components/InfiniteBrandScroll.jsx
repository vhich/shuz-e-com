import React from "react";
import { brands } from "../assets/asset";
const InfiniteBrandScroll = () => {
  // We double the array to ensure there's no gap during the transition
  const duplicatedBrands = [...brands, ...brands];

  return (
    <div className="bg-gray-900 h-50 relative overflow-hidden before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-20 before:bg-linear-to-r before:from-black before:to-transparent after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-20 after:bg-linear-to-l after:from-black after:to-transparent">
      <div className="flex items-center justify-center mx-12 h-full w-max animate-scroll">
        {duplicatedBrands.map((brand, index) => (
          <div
            key={index}
            className="flex items-center justify-center lg:mx-12 md:mx-10"
          >
            <img
              src={brand.logo}
              alt={brand.name}
              className="max-w-full max-h-full object-contain grayscale hover:grayscale-0 transition-all duration-300"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfiniteBrandScroll;
