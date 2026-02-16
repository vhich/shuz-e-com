import React, { useState, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAppContext } from "../context/AppContent";
import AdminNavbar from "../components/AdminNavbar";
import SideNav from "../components/SideNav";
import BottomSpace from "../components/BottomSpace";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import Loading from "../components/Loading";

const AllProducts = () => {
  const {
    products,
    fetchAllProducts,
    isLoggedIn,
    setEditMode,
    deleteProduct,
    backendUrl,
  } = useAppContext();
  const [showAll, setShowAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("latest");

  const navigate = useNavigate();

  // 3. Initial Load
  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  // 2. useMemo Hooks (Top Level - NEVER inside a function)
  const uniqueCategories = useMemo(() => {
    const allCats = products.flatMap((p) => p.categories || []);
    return ["All", ...new Set(allCats)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let tempProducts = [...products];

    // 1. Search Filter
    if (searchTerm) {
      tempProducts = tempProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.sku.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // 2. Category Filter
    if (categoryFilter !== "All") {
      tempProducts = tempProducts.filter((p) =>
        p.categories.includes(categoryFilter),
      );
    }

    // 3. Sort Logic
    if (sortOrder === "low-high") {
      tempProducts.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "high-low") {
      tempProducts.sort((a, b) => b.price - a.price);
    } else if (sortOrder === "latest") {
      tempProducts.reverse();
    } else if (sortOrder === "discount") {
      tempProducts = tempProducts.filter((p) => p.discount > 0);
    } else if (sortOrder === "no-discount") {
      tempProducts = tempProducts.filter((p) => p.discount === 0);
    }

    // 4. STOCK LOGIC (Added without destroying your filters)
    return tempProducts.map((product) => {
      // Sum up stock across all size variations
      const totalStock = product.sizes.reduce(
        (acc, s) => acc + Number(s.stock),
        0,
      );

      return {
        ...product,
        totalStock,
        isOutOfStock: totalStock === 0,
        isLowStock: totalStock <= 5,
      };
    });
  }, [products, searchTerm, categoryFilter, sortOrder]);

  const displayedProducts = useMemo(() => {
    return showAll ? filteredProducts : filteredProducts.slice(0, 10);
  }, [filteredProducts, showAll]);

  const deleteAllProducts = async () => {
    const adminSecret = import.meta.env.ADMIN_DELETE_PASS_KEY;

    if (
      window.confirm("⚠️ WARNING: This will permanently delete EVERY product!")
    ) {
      try {
        const { data } = await axios.delete(
          `${backendUrl}/shuz/products/flush`,
          {
            headers: {
              "x-admin-secret": adminSecret,
            },
          },
        );
        if (data.success) {
          toast.success("Inventory cleared");
          fetchAllProducts();
        }
      } catch (error) {
        console.log(error);

        alert("Action failed: Unauthorized");
      }
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [navigate, isLoggedIn]);

  useEffect(() => {
    document.title = "Admin Dashboard - Products";
    document.body.style.overflowY = "hidden";
  }, []);

  return (
    <>
      <Loading />
      <AdminNavbar />
      <main className="w-screen">
        <div className="grid lg:grid-cols-[15%_85%] sm:grid-cols-1">
          <SideNav />
          <section className="bg-green-50 h-screen w-full overflow-y-auto py-12 px-2 md:px-10 lg:px-15">
            <div className="p-4 sm:p-8 bg-white rounded-xl shadow-sm border border-gray-100">
              {/* HEADER SECTION */}
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                  <h6 className="text-2xl font-black text-gray-900">
                    Product Inventory
                  </h6>
                  <p className="text-gray-500 text-sm">
                    Showing {displayedProducts.length} of {products.length}{" "}
                    items
                  </p>
                </div>
                <button
                  onClick={deleteAllProducts}
                  className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-600 hover:text-white transition-all border border-red-100"
                >
                  Flush All Products
                </button>
              </div>

              {/* FILTER BAR SECTION */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <input
                  type="text"
                  placeholder="Search name or SKU..."
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black text-sm"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  {uniqueCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === "All" ? "All Categories" : cat}
                    </option>
                  ))}
                </select>
                <select
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black text-sm"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="latest">Sort by: Latest</option>
                  <option value="low-high">Price: Low to High</option>
                  <option value="high-low">Price: High to Low</option>
                  <option value="discount">Discounts</option>
                  <option value="no-discount">No discount</option>
                </select>
              </div>

              {/* TABLE SECTION */}
              <div className="overflow-x-auto border border-gray-200 rounded-xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-400 text-xs uppercase tracking-widest">
                      <th className="px-6 py-4 font-medium">Image</th>
                      <th className="px-6 py-4 font-medium">Product Name</th>
                      <th className="px-6 py-4 font-medium">Category</th>
                      <th className="px-6 py-4 font-medium">Price / DP</th>
                      <th className="px-6 py-4 font-medium text-center">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredProducts.length > 0 ? (
                      displayedProducts.map((item) => (
                        <tr
                          key={item._id}
                          className={`hover:bg-gray-50 transition-colors group`}
                        >
                          <td className="px-6 py-4">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 object-contain rounded-lg border bg-gray-100"
                            />
                          </td>
                          <td className="px-6 py-4 font-bold text-gray-800">
                            <span className="flex! gap-1">
                              {item.discount > 0 && (
                                <span className="line-clamp-1 text-green-700 text-sm!">
                                  {item.discount}% Discount
                                </span>
                              )}
                              {item.isOutOfStock && (
                                <span className="line-clamp-1 text-sm! font-medium! text-red-400 ">
                                  Out of stock!
                                </span>
                              )}
                            </span>
                            {item.isLowStock && (
                              <span className="line-clamp-1 text-sm! font-medium! text-red-400 ">
                                {item.totalStock} item(s) remaining
                              </span>
                            )}

                            <span className="line-clamp-1 font-medium!">
                              {item.name}
                            </span>
                            <span className="text-[10px] text-gray-400 block font-normal uppercase">
                              SKU: {item.sku}
                            </span>
                          </td>

                          {/* Improved Category Display */}
                          <td className="px-6 py-4 text-gray-600 text-sm">
                            {item.categories.slice(0, 2).join(" / ")}
                          </td>

                          {item.discount ? (
                            <td className="px-6 py-4 font-black text-gray-900">
                              <span className="line-clamp-1 font-black! text-gray-900">
                                {" "}
                                $
                                {(
                                  item.price -
                                  (item.price * item.discount) / 100
                                ).toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </span>
                              <span className="text-[10px] text-gray-400 block font-normal uppercase">
                                $
                                {item.price.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </span>
                            </td>
                          ) : (
                            <td className="px-6 py-4 font-black text-gray-900">
                              $
                              {item.price.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </td>
                          )}

                          <td className="px-6 py-4 text-center flex justify-center">
                            <button
                              onClick={() => deleteProduct(item._id)}
                              className="text-gray-400 hover:text-red-600 transition-colors p-2"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() =>
                                navigate(`/admin/product-info/${item._id}`)
                              }
                              className="text-gray-600! hover:text-green-500!"
                            >
                              <Eye size={20} />
                            </button>
                            <button
                              onClick={() => {
                                navigate("/admin/upload-product", {
                                  state: { product: item },
                                });
                                setEditMode(true);
                              }}
                              className="text-gray-400 hover:text-blue-600 transition-colors p-2"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      /* Empty State wrapped in a proper table row */
                      <tr>
                        <td colSpan="5" className="px-6 py-20 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <h6 className="text-lg font-bold text-gray-900">
                              Oops!
                            </h6>
                            <p className="text-gray-400">
                              No results found for your search or filter.
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* VIEW ALL TOGGLE */}
              {filteredProducts.length > 10 && (
                <div className="mt-8 text-center">
                  <button
                    onClick={() => setShowAll(!showAll)}
                    className="px-8 py-3 bg-gray-900 text-white rounded-full font-bold text-sm uppercase tracking-widest hover:bg-black transition-all shadow-lg"
                  >
                    {showAll
                      ? "Show Less"
                      : `View All (${filteredProducts.length})`}
                  </button>
                </div>
              )}
            </div>
            <BottomSpace />
          </section>
        </div>
      </main>
    </>
  );
};

export default AllProducts;
