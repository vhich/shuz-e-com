import React from "react";
import ProductCard from "./ProductCard";
import { productCard } from "../assets/asset";
import { NavLink } from "react-router-dom";

const NewArrivals = () => {
  return (
    <section className="py-12">
      <h4 className="text-center mb-8">New Arrivals</h4>
      <div className="container grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 sm:gap-2 lg:gap-4">
        {productCard.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <NavLink
        to="/collections/new-arrivals"
        className="sec-btn text-center mt-8 m-auto"
      >
        View All
      </NavLink>
    </section>
  );
};

export default NewArrivals;
