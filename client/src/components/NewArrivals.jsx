import React, { useContext, useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { NavLink } from "react-router-dom";
import { AppContent } from "../context/AppContent";
import axios from "axios";

const NewArrivals = () => {
  const [newProducts, setNewProducts] = useState(null);
  const { backendUrl } = useContext(AppContent);

  useEffect(() => {
    const fetchNewProducts = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/shuz/products`);

        if (data?.success) {
          // 2. Update state
          setNewProducts(data.data);
        }
      } catch (error) {
        console.error("Error fetching products", error);
        alert("Error fetching products");
        window.location.href = "/";
      }
    };

    fetchNewProducts();
    return undefined;
  }, []);
  return (
    <section className="py-12">
      <h4 className="text-center mb-8">New Arrivals</h4>
      <div className="container grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 sm:gap-2 lg:gap-4">
        {newProducts &&
          newProducts
            .reverse()
            .splice(0, 4)
            .map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
      </div>
      <NavLink to="/shop" className="sec-btn text-center mt-8 m-auto">
        View All
      </NavLink>
    </section>
  );
};

export default NewArrivals;
