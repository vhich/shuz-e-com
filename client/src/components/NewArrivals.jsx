import { useContext } from "react";
import { AppContent } from "../context/AppContent";
import ProductCard from "./ProductCard";

const NewArrivals = () => {
  const { newProducts } = useContext(AppContent);

  return (
    <section className="py-12">
      <h4 className="text-center mb-8">New Arrivals</h4>
      <div className="container grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 sm:gap-2 lg:gap-4">
        {newProducts ? (
          newProducts
            .reverse()
            .map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
        ) : (
          <p className="text-gray-400">Loading..</p>
        )}
      </div>
      {/* <NavLink to="/shop" className="sec-btn text-center mt-8 m-auto">
        View All
      </NavLink> */}
    </section>
  );
};

export default NewArrivals;
