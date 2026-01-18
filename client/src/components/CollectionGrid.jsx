import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/asset";

const CollectionGrid = () => {
  return (
    <section className="py-12">
      <div className="container mx-auto">
        {/* MOBILE: flex with horizontal scroll (snap-x makes it feel like an app)
            DESKTOP: grid-cols-4 grid-rows-2 
        */}
        <div className="flex overflow-x-auto pb-6 gap-4 snap-x snap-mandatory md:grid md:grid-cols-4 md:grid-rows-2 md:h-150 md:overflow-visible scrollbar-hide">
          {/* 1. Sports shoes(Full hierarchy) */}
          <div className="sports-col min-w-[85%] md:min-w-full md:col-span-2 md:row-span-2 snap-center relative h-100 md:h-auto overflow-hidden rounded-2xl bg-green-300 flex flex-col-reverse items-center justify-center">
            <div className="img">
              <img src={assets.season_sale_img1} alt="sales shoe" />
            </div>
            <div className="z-10">
              <h2 className="uppercase">Sports</h2>
              <p className="font-bold!">Shoe collection</p>
              <NavLink
                to="/collections/sports-shoes"
                className={"pry-btn my-4"}
              >
                Shop Now
              </NavLink>
            </div>
          </div>

          {/* 2. MEN */}
          <div className="men-col min-w-[70%] md:min-w-full md:col-span-2 snap-center relative h-100 md:h-auto overflow-hidden rounded-2xl bg-amber-200 grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 items-center justify-around px-4">
            <div className="img order-2 lg:order-1 md:order-1">
              <img src={assets.season_sale_img2} alt="sales shoe" />
            </div>
            <div className="z-10">
              <p className="text-xs font-bold!">15% off</p>
              <h6 className="uppercase">Men shoe collection</h6>
              <NavLink
                to="/collections/sports-shoes"
                className={"pry-btn my-4"}
              >
                Shop Now
              </NavLink>
            </div>
          </div>

          {/* 3. WOMEN */}
          <div className="women-col min-w-[70%] md:min-w-full md:col-span-2 snap-center relative h-100 md:h-auto overflow-hidden rounded-2xl bg-pink-200 grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 items-center justify-around px-4">
            <div className="img order-2 lg:order-1 md:order-1">
              <img src={assets.season_sale_img3} alt="sales shoe" />
            </div>
            <div className="z-10">
              <p className="text-xs font-bold!">20% off</p>
              <h6 className="uppercase">Women shoe collection</h6>
              <NavLink
                to="/collections/sports-shoes"
                className={"pry-btn my-4"}
              >
                Shop Now
              </NavLink>
            </div>
          </div>
        </div>

        {/* Optional: Mobile Scroll Indicator */}
        <div className="md:hidden flex justify-center mt-2 italic text-xs font-bold text-gray-400">
          Swipe to explore →
        </div>
      </div>
    </section>
  );
};

export default CollectionGrid;
