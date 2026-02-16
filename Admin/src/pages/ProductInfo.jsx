import React, { useState, useEffect } from "react";
import AdminNavbar from "../components/AdminNavbar";
import BottomSpace from "../components/BottomSpace";
import SideNav from "../components/SideNav";
import { useAppContext } from "../context/AppContent";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import axios from "axios";
import Loading from "../components/Loading";
import { Trash2, SquarePen } from "lucide-react";
import { HiArrowLeft } from "react-icons/hi2";

const ProductInfo = () => {
  const [product, setProduct] = useState(null);

  const { backendUrl, setLoading, deleteProduct, setEditMode, isLoggedIn } =
    useAppContext();

  const { id } = useParams();

  const navigate = useNavigate();
  useEffect(() => {
    !isLoggedIn && navigate("/");
  }, [isLoggedIn, navigate]);
  useEffect(() => {
    document.title = "Admin Dashboard - Product Details";
    document.body.style.overflowY = "hidden";
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });

    const fetchProductDetail = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${backendUrl}/shuz/products/${id}`, {
          headers: { "cache-control": "no-cache" },
        });

        if (data.success) {
          const fetchedProduct = data.data;
          setProduct(fetchedProduct);
          // 1. Look inside the array objects to see if at least one size has stock
          const isAvailable = fetchedProduct.sizes.some((s) => s.stock > 0);

          // 2. Calculate total count by summing 'stock' from each object
          const totalStockCount = fetchedProduct.sizes.reduce(
            (acc, curr) => acc + (curr.stock || 0),
            0,
          );

          setProduct({
            ...fetchedProduct,
            isAvailable,
            totalStockCount,
          });
        }
      } catch (error) {
        console.error("Error matching product ID:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [id, backendUrl, setLoading]);
  return (
    <>
      <Loading />
      <AdminNavbar />
      <main className="w-screen">
        <div className="grid lg:grid-cols-[15%_85%] sm:grid-cols-1">
          <SideNav />
          <section className="bg-green-50 h-screen w-full overflow-y-auto py-12 px-2 md:px-10 lg:px-15">
            <div className="flex flex-row-reverse mb-12">
              <NavLink
                to="/admin/products"
                className={
                  "flex! items-center gap-3 py-2 px-4 hover:bg-gray-100"
                }
              >
                <HiArrowLeft />
                Back
              </NavLink>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 md-grid-cols-2 bg-gray-50">
              {/* LEFT SIDE: Image Gallery Preview */}
              <div className="relative w-full aspect-square rounded-xl overflow-hidden">
                <img
                  src={product && product.image}
                  alt={product && product.name}
                  className="w-full h-full object-contain mix-blend-multiply"
                />
                {product && product.discount > 0 && (
                  <span className="absolute top-0 left-0 bg-red-600 text-white px-4 py-1 rounded-full font-bold text-sm">
                    -{product && product.discount}%
                  </span>
                )}
              </div>

              {/* RIGHT SIDE: Product Details */}
              <div className="p-8 md:p-12 overflow-y-auto">
                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-bold text-green-700 uppercase tracking-widest mb-2">
                      {product && product.categories.join(" / ")}
                    </p>
                    <h5 className="text-4xl font-black text-gray-900 leading-tight">
                      {product && product.name}
                    </h5>
                    <p className="text-gray-400 mt-1">
                      SKU: {product && product.sku}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-3xl! font-bold! text-green-600">
                      $
                      {Number(product && product.price).toLocaleString(
                        undefined,
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        },
                      )}
                    </span>
                    {product && product.discount > 0 && (
                      <span className="text-2xl! text-gray-400 line-through!">
                        $
                        {(
                          product.price -
                          (product.price * product.discount) / 100
                        ).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    )}
                  </div>

                  <div className="stock my-10">
                    <span
                      className={`text-gray-600 ${product && product.totalStockCount >= 6 ? "bg-green-200 text-green-800" : "bg-red-100 text-red-500"} px-2 py-1 rounded`}
                    >
                      {product && product.isAvailable
                        ? `In Stock`
                        : "Out of Stock"}
                    </span>

                    {product && product.totalStockCount > 6 && (
                      <span className="text-sm ml-2 text-gray-600">
                        <span className="text-green-700"></span>
                        <span className="text-green-700">
                          {product.totalStockCount}
                        </span>{" "}
                        item available
                      </span>
                    )}
                    {product && product.totalStockCount < 6 && (
                      <span className="text-sm ml-2 text-gray-600">
                        <span className="text-red-500">Restock! </span>only{" "}
                        <span className="text-red-500">
                          {product.totalStockCount}
                        </span>{" "}
                        item(s) available
                      </span>
                    )}
                  </div>

                  <div className="border-t bg-slate-200 border-gray-300">
                    <div>
                      <table className="w-full">
                        <thead className="bg-slate-300">
                          <tr className=" border-b border-gray-200 text-slate-600 text-xs uppercase tracking-widest">
                            <th className="py-2 font-medium">Size</th>
                            <th className="py-2 font-medium">Stock</th>
                          </tr>
                        </thead>
                        <tbody>
                          {product &&
                            product.sizes?.map((s, index) => (
                              <tr
                                key={s + `${index}`}
                                className="py-2 text-gray-700 text-center border-b border-gray-500"
                              >
                                <td>{s.value}</td>
                                <td>{s.stock}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 py-3 border-t border-gray-300 px-3">
              <h6 className="font-bold my-2">Description</h6>
              <p className="text-gray-600 leading-relaxed">
                {product && product.description}
              </p>
            </div>
            <div className="action-btns flex flex-row-reverse gap-4 mt-10">
              <button
                onClick={() => {
                  navigate("/admin/upload-product", {
                    state: { product: product },
                  });
                  setEditMode(true);
                }}
                className=" py-3 px-8 rounded-xl border-2 border-gray-800 hover:border-gray-600 flex items-center gap-3 active:scale-95"
              >
                <SquarePen size={18} />
                Edit
              </button>
              <button
                onClick={() => deleteProduct(product._id)}
                className="bg-red-500 hover:bg-red-600 transition-colors py-3 px-8 rounded-xl text-white flex items-center gap-3 active:scale-95"
              >
                <Trash2 size={18} />
                Delete
              </button>
            </div>

            <BottomSpace />
          </section>
        </div>
      </main>
    </>
  );
};

export default ProductInfo;
