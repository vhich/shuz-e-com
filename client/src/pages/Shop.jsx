import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { Filter, X, ChevronDown } from "lucide-react";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";
import Feature from "../components/Feature";
import Newsletter from "../components/Newsletter";
import Jumbotron from "../components/Jumbotron";

const Shop = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // --- LOGIC: STATE ---
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [sortBy, setSortBy] = useState("Default Sorting");
  const [currentPage, setCurrentPage] = useState(1);

  // --- LOGIC: DATA ---
  // --- LOGIC: DATA ---
  const allProducts = [
    {
      id: 1,
      name: "Nike Air Max 270",
      price: 150,
      category: "Running",
      popularity: 90,
      date: 2024,
    },
    {
      id: 2,
      name: "Nike Joyride Dual",
      price: 80,
      category: "Running",
      popularity: 85,
      date: 2023,
    },
    {
      id: 3,
      name: "Jordan Retro High",
      price: 190,
      category: "Basketball",
      popularity: 99,
      date: 2024,
    },
    {
      id: 4,
      name: "Vans Old Skool",
      price: 45,
      category: "Lifestyle",
      popularity: 70,
      date: 2022,
    },
    {
      id: 5,
      name: "Adidas Ultraboost",
      price: 120,
      category: "Running",
      popularity: 92,
      date: 2024,
    },
    {
      id: 6,
      name: "Puma Training Pro",
      price: 60,
      category: "Training",
      popularity: 75,
      date: 2023,
    },
    {
      id: 7,
      name: "Puma Training Pro v2",
      price: 65,
      category: "Training",
      popularity: 75,
      date: 2023,
    }, // Changed id from 6 to 7
    {
      id: 8,
      name: "airmax Training Pro",
      price: 60,
      category: "Training",
      popularity: 75,
      date: 2025,
    }, // Changed id from 7 to 8
    {
      id: 9,
      name: "xproTraining Pro",
      price: 60,
      category: "Running",
      popularity: 75,
      date: 2023,
    }, // Changed id from 8 to 9
  ];

  // --- LOGIC: FILTERING & SORTING ---
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // Category Filter
    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category));
    }

    // Price Filter
    if (selectedPriceRange === "Under $50")
      result = result.filter((p) => p.price < 50);
    else if (selectedPriceRange === "$50 - $100")
      result = result.filter((p) => p.price >= 50 && p.price <= 100);
    else if (selectedPriceRange === "$100 - $150")
      result = result.filter((p) => p.price >= 100 && p.price <= 150);
    else if (selectedPriceRange === "Over $150")
      result = result.filter((p) => p.price > 150);

    // Sort Logic
    if (sortBy === "Popularity")
      result.sort((a, b) => b.popularity - a.popularity);
    if (sortBy === "Latest") result.sort((a, b) => b.date - a.date);
    if (sortBy === "Price: Low to High")
      result.sort((a, b) => a.price - b.price);
    if (sortBy === "Price: High to Low")
      result.sort((a, b) => b.price - a.price);

    return result;
  }, [selectedCategories, selectedPriceRange, sortBy]);

  // Pagination Logic
  const itemsPerPage = 4;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentItems = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Handlers
  const handleCategoryChange = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
    setCurrentPage(1);
  };

  return (
    <>
      <Jumbotron text={"Shop"} />
      <div className="container">
        {/* --- MOBILE FILTER DRAWER --- */}
        <div
          className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${isFilterOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        >
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsFilterOpen(false)}
          />
          <div
            className={`absolute left-0 top-0 h-full w-80 bg-white p-6 transition-transform duration-300 ${isFilterOpen ? "translate-x-0" : "-translate-x-full"}`}
          >
            <div className="flex justify-between items-center mb-8">
              <p className="text-lg! font-medium! text-gray-700 mb-6">
                Filters
              </p>
              <button onClick={() => setIsFilterOpen(false)}>
                <X />
              </button>
            </div>
            <FilterContent
              selectedCategories={selectedCategories}
              handleCategoryChange={handleCategoryChange}
              setSelectedPriceRange={setSelectedPriceRange}
            />
          </div>
        </div>

        <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* --- DESKTOP SIDEBAR --- */}
            <aside className="hidden lg:block w-64 shrink-0">
              <p className="text-lg! font-medium! text-gray-700 mb-6">
                Filters
              </p>
              <FilterContent
                selectedCategories={selectedCategories}
                handleCategoryChange={handleCategoryChange}
                setSelectedPriceRange={setSelectedPriceRange}
              />
            </aside>

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1" id="mainContent">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <button
                  onClick={() => setIsFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 border px-4 py-2 rounded-md font-medium"
                >
                  <Filter size={18} /> Filters
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <span className="text-sm text-gray-500 hidden md:block">
                    Sort by:
                  </span>
                  <select
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="border-none bg-gray-50 rounded-lg px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-black cursor-pointer"
                  >
                    <option>Default Sorting</option>
                    <option>Popularity</option>
                    <option>Latest</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                  </select>
                </div>
              </div>

              {/* Product Grid or Empty State */}
              {currentItems.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-10">
                    {currentItems.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  {/* Pagination (Only show if there are multiple pages) */}
                  {totalPages > 1 && (
                    <div
                      className="mt-16 flex justify-center gap-2"
                      onClick={window.scrollTo({ top: 100, left: 0 })}
                    >
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`px-4 py-2 border rounded-md transition-colors ${currentPage === i + 1 ? "bg-black text-white border-black" : "border-gray-200 hover:border-black"}`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="bg-gray-100 p-6 rounded-full mb-4">
                    <Filter className="text-gray-400" size={48} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    No results found
                  </h2>
                  <p className="text-gray-500 mt-2">
                    Try adjusting your filters or sorting to find what
                    you&apos;re looking for.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategories([]);
                      setSelectedPriceRange("");
                      setSortBy("Default Sorting");
                    }}
                    className="mt-6 text-black font-semibold underline decoration-2 underline-offset-4 hover:text-gray-600 transition-colors"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
      <Feature />
      <Newsletter />
    </>
  );
};

// Reusable Filter Sections
const FilterContent = ({
  selectedCategories,
  handleCategoryChange,
  setSelectedPriceRange,
}) => (
  <div className="space-y-8">
    <div>
      <p className="font-medium! text-xl! mb-4 text-gray-900">Categories</p>
      <div className="space-y-2 text-gray-600">
        {["Lifestyle", "Running", "Basketball", "Training"].map((cat) => (
          <label
            key={cat}
            className="flex items-center gap-3 cursor-pointer hover:text-black"
          >
            <input
              type="checkbox"
              checked={selectedCategories.includes(cat)}
              onChange={() => handleCategoryChange(cat)}
              className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
            />
            <span>{cat}</span>
          </label>
        ))}
      </div>
    </div>

    <div>
      <p className="font-medium! text-xl! mb-4 text-gray-900">Price Range</p>
      <div className="space-y-2 text-gray-600">
        {[
          "All Prices",
          "Under $50",
          "$50 - $100",
          "$100 - $150",
          "Over $150",
        ].map((price) => (
          <label key={price} className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="price"
              onChange={() =>
                setSelectedPriceRange(price === "All Prices" ? "" : price)
              }
              className="w-4 h-4 border-gray-300 text-black focus:ring-black"
            />
            <span>{price}</span>
          </label>
        ))}
      </div>
    </div>
  </div>
);

FilterContent.propTypes = {
  selectedCategories: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleCategoryChange: PropTypes.func.isRequired,
  setSelectedPriceRange: PropTypes.func.isRequired,
};

export default Shop;
