import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import PropTypes from "prop-types";
import { useContext, useEffect, useState } from "react";
import { FiPackage, FiSearch, FiX } from "react-icons/fi";
import { AppContent } from "../context/AppContent"; // Adjust this path if your context is named differently
import ProductCard from "./ProductCard";

const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Access your central backendUrl context configuration
  const { backendUrl } = useContext(AppContent);

  // --- LOGIC: DEBOUNCED API SEARCH ---
  useEffect(() => {
    // If the user clears the text field, immediately clear results without waiting on debounce
    if (query.trim() === "") {
      setResults([]);
      return;
    }

    setLoading(true);

    // Set up a 400ms delay timer before hitting the database
    const delayDebounceFn = setTimeout(async () => {
      try {
        const { data } = await axios.get(
          `${backendUrl}/me/shuz/products/search?q=${encodeURIComponent(query)}`,
        );
        if (data.success) {
          setResults(data.data);
        }
      } catch (error) {
        console.error("Database query search error:", error);
      } finally {
        setLoading(false);
      }
    }, 400); // 400ms is the sweet spot between fast UX and low server stress

    // Clean up the timeout if the user types another letter before 400ms is up
    return () => clearTimeout(delayDebounceFn);
  }, [query, backendUrl]);

  // Reset modal state cleanly whenever it closes
  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

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
            className="bg-white w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Search Input Header */}
            <div className="p-6 border-b border-gray-100 flex items-center gap-4">
              <FiSearch className="text-emerald-500 text-2xl" />
              <input
                autoFocus
                type="text"
                value={query}
                placeholder="Search products by name & category"
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
              <p className="text-slate-500 text-sm my-4">
                {results.length} result(s)
              </p>
              {loading ? (
                /* Sleek loading micro-indicator using your theme colors */
                <div className="py-12 text-center text-emerald-500 font-medium">
                  {query.length > 1 ? (
                    <>
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto mb-2" />
                      <p className="text-slate-400 text-sm">Please wait...</p>
                    </>
                  ) : (
                    <>
                      <FiPackage className="mx-auto text-4xl mb-2 opacity-20" />
                      <p className="text-slate-400 text-sm">
                        Start typing to search...
                      </p>
                    </>
                  )}
                </div>
              ) : results.length > 0 ? (
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
};

export default SearchModal;
