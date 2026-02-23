import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiSearch, FiPackage } from "react-icons/fi";
import PropTypes from "prop-types";
import ProductCard from "./ProductCard";
import { useEffect } from "react";

const SearchModal = ({ isOpen, onClose, products }) => {
  const [query, setQuery] = useState("");

  // Filter logic
  const results =
    query.trim() === ""
      ? []
      : products.filter(
          (p) =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.categories.filter((cat) =>
              cat.toLowerCase().includes(query.toLowerCase()),
            ).length > 0,
        );

  useEffect(() => {
    if (onClose) {
      setQuery("");
    }
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xl flex justify-center items-start pt-20 px-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Search Input Header */}
            <div className="p-6 border-b border-gray-100 flex items-center gap-4">
              <FiSearch className="text-emerald-500 text-2xl" />
              <input
                autoFocus
                type="text"
                placeholder="Search products, categories..."
                className="flex-1 bg-transparent border-none outline-none text-xl font-medium text-slate-800"
                onChange={(e) => setQuery(e.target.value)}
              />
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FiX className="text-slate-400 text-xl" />
              </button>
            </div>

            {/* Results Area */}
            <div className="max-h-[60vh] overflow-y-auto p-4">
              {results.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 sm:gap-4 gap-2">
                  {results.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400">
                  <FiPackage className="mx-auto text-4xl mb-2 opacity-20" />
                  <p>
                    {query ? "No products found." : "Start typing to search..."}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

SearchModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  products: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      image: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default SearchModal;
