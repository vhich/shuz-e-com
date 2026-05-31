import { useContext, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/asset";
import BestSeller from "../components/BestSeller";
import CategoryList from "../components/CategoryList";
import CollectionGrid from "../components/CollectionGrid";
import Feature from "../components/Feature";
import { Hero } from "../components/Hero";
import InfiniteBrandScroll from "../components/InfiniteBrandScroll";
import NewArrivals from "../components/NewArrivals";
import Newsletter from "../components/Newsletter";
import Reviews from "../components/Reviews";
import { AppContent } from "../context/AppContent";

const Homepage = () => {
  const { fetchHomeData, backendUrl } = useContext(AppContent);
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, []);

  useEffect(() => {
    fetchHomeData();
    return;
  }, [backendUrl]);

  return (
    <>
      <Hero />
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
