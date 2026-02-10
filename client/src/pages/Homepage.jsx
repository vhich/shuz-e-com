import React, { useEffect } from "react";
import { assets } from "../assets/asset";
import Navbar from "../components/Navbar";
import Feature from "../components/Feature";
import CollectionGrid from "../components/CollectionGrid";
import NewArrivals from "../components/NewArrivals";
import BestSeller from "../components/BestSeller";
import CategoryList from "../components/CategoryList";
import Reviews from "../components/Reviews";
import InfiniteBrandScroll from "../components/InfiniteBrandScroll";
import Newsletter from "../components/Newsletter";
import { NavLink } from "react-router-dom";
// import { AppContent } from "../context/AppContent";

const Homepage = () => {
  // const { userData } = useContext(AppContent);
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, []);

  return (
    <>
      <section
        className={`relative bg-[url('/src/assets/images/hero_bg.png')] bg-center bg-cover`}
      >
        <Navbar />
        <div className="container h-full lg:grid grid-cols-1 items-center sm:block sm:pt-8 md:grid place-items-center pb-6">
          <div className="text-center grid place-items-center mb-10 text-gray-800">
            <h5>Style destination</h5>
            <h1 className="text-gray-900 uppercase">
              The new shoe <br></br>collection
            </h1>
            <p className="text-gray-600">
              Discover the latest styles and comfort in every step.
            </p>
            <NavLink to={"/shop"} className="pry-btn my-4 mx-auto block!">
              Shop Now
            </NavLink>
          </div>
          <div>
            {assets.xpro_1 && (
              <img
                src={assets.xpro_1}
                alt="XPro 1"
                className="object-contain"
              />
            )}
          </div>
        </div>
      </section>
      <Feature />
      <CollectionGrid />
      <CategoryList />
      <NewArrivals />
      <section className="bg-green-200 relative overflow-hidden">
        <div className="circle bg-green-400 rounded-full absolute -top-30 -right-60"></div>
        <div className="container grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 items-center py-12">
          <div className="z-10">
            <h1 className="mb-4">RUNNING SHOES SALE OFF 50%</h1>
            <p className="mb-4">
              Get the latest running shoes at half price, don&apos;t miss it!
            </p>
            <NavLink to={"/shop"} className="pry-btn">
              Shop Now
            </NavLink>
          </div>
          <div className="flex justify-center relative z-10">
            {assets.running_shoe1 && (
              <img
                src={assets.running_shoe1}
                alt="Running Shoe 1"
                className="object-contain"
              />
            )}
          </div>
        </div>
      </section>
      <BestSeller />
      <Reviews />
      <Newsletter />
      <InfiniteBrandScroll />
    </>
  );
};

export default Homepage;
