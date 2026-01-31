import React, { useContext } from "react";
// import { productCard } from "../assets/asset";
import ProductCard from "./ProductCard";
import { AppContent } from "../context/AppContent";

const BestSeller = () => {
  const { bestSellerProducts } = useContext(AppContent);
  // const bestSeller = productCard.slice(0, 4).reverse();

  return (
    <section className="py-12">
      <div className="container">
        <h4 className="my-8">Best Seller Shoes</h4>
        <div className="grid grid-cols-2 lg:grid-cols-4 md:grid-cols-3 sm:gap-2 lg:gap-4">
          {/* {bestSeller.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))} */}
          {bestSellerProducts ? (
            bestSellerProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <p className="text-gray-400">Loading..</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default BestSeller;
