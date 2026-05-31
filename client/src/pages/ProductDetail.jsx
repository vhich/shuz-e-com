import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Added for URL ID
// import axios from "axios";
import { FaStar } from "react-icons/fa";
import { toast } from "react-toastify";
import BestSeller from "../components/BestSeller";
import Navbar from "../components/Navbar";
import ReviewPagination from "../components/ReviewPagination";
import { AppContent } from "../context/AppContent";

const ProductDetail = () => {
  const { id } = useParams(); // Get ID from URL
  const {
    fetchBestNewProduct,
    backendUrl,
    setCartItems,
    cartItems,
    setLoading,
    setProduct,
    product,
    isLoggedIn,
    userData,
    api,
  } = useContext(AppContent);
  const [selectedSize, setSelectedSize] = useState(null);
  const [pagination, setPagination] = useState("description");

  // Helper variables for price
  const [discountPrice, setDiscountPrice] = useState(0);
  const [hasDiscountPrice, setHasDiscountPrice] = useState(false);

  const navigate = useNavigate();

  const cartKey = product && `${product._id}-${selectedSize}`;
  const currentQtyInCart = cartItems[cartKey]?.quantity || 0;

  // 2. Find the stock for the selected size
  const selectedSizeStock =
    (product && product.sizes.find((s) => s.value === selectedSize)?.stock) ||
    0;

  // 3. Determine if the button should be disabled
  const isMaxedOut = selectedSize && currentQtyInCart >= selectedSizeStock;

  const addToCart = async () => {
    if (!selectedSize) return toast.error("Select Size!");

    const cartKey = `${product._id}-${selectedSize}`;

    // No need to define sizeData here anymore since you have selectedSizeStock!

    const finalPrice =
      product.discount > 0
        ? product.price - product.price * (product.discount / 100)
        : product.price;

    const newItem = {
      _id: product._id,
      name: product.name,
      size: selectedSize,
      price: finalPrice,
      image: product.image,
      quantity: 1,
    };

    setCartItems((prev) => {
      const currentQty = prev[cartKey]?.quantity || 0;

      // USE YOUR VARIABLE HERE:
      if (currentQty + 1 > selectedSizeStock) {
        toast.error(`Only ${selectedSizeStock} items available in this size!`);
        return prev;
      }

      const updated = { ...prev };
      if (updated[cartKey]) {
        updated[cartKey].quantity += 1;
      } else {
        updated[cartKey] = newItem;
      }

      if (isLoggedIn) {
        api.post(backendUrl + "/cart/update", {
          cartKey,
          productId: product._id,
          size: selectedSize,
          quantity: updated[cartKey].quantity,
          clientId: userData._id,
        });
      }
      return updated;
    });

    toast.success("Added to cart!");
    navigate("/cart");
  };

  useEffect(() => {
    fetchBestNewProduct();
    return;
  }, [backendUrl]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });

    const fetchProductDetail = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(
          `${backendUrl}/admin/shuz/products/${id}`,
        );

        if (data.success) {
          const fetchedProduct = data.data;
          const reviews = data.review;
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
            reviews,
          });

          // Set discount logic once product is loaded
          if (fetchedProduct.discount > 0) {
            setHasDiscountPrice(true);
            const price =
              fetchedProduct.price -
              (fetchedProduct.price * fetchedProduct.discount) / 100;
            setDiscountPrice(
              price.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }),
            );
          }
        }
      } catch (error) {
        console.error("Error matching product ID:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [id, backendUrl]);

  if (!product)
    return (
      <div className="container py-20 text-center font-bold">
        <h5>Product not found</h5>
        <button
          onClick={() => (window.location.href = "/shop")}
          className="pry-btn mx-auto!"
        >
          Go to shop
        </button>
      </div>
    );

  return (
    <>
      <Navbar />
      <section className="min-h-screen py-12">
        <div className="container">
          <div className="lg:grid lg:grid-cols-2 md:grid-cols-2 lg:gap-x-12 items-start">
            {/* LEFT COLUMN: Image Section */}
            <div className="w-full aspect-square static lg:sticky lg:top-8">
              <div className="img_prev h-full w-full rounded-2xl overflow-hidden bg-white flex items-center justify-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain object-center hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* RIGHT COLUMN: Details Section */}
            <div className="mt-10 px-4 sm:px-0 lg:mt-0">
              <div className="border-b border-gray-200 pb-6">
                <nav className="flex mb-4 text-xs font-medium text-gray-500 uppercase tracking-widest">
                  <span>Footwear</span> <span className="mx-2">/</span>{" "}
                  <span>{product.categories?.[0] || "Running"}</span>
                </nav>
                <h4 className="text-gray-900 capitalize">{product.name}</h4>
                <div className="ratings my-3 flex gap-4 flex-wrap items-center">
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={
                          i < product.reviews[0]?.rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-gray-500 ml-2">
                    ({product?.reviews.length > 0 ? product?.reviews.length : 0}{" "}
                    reviews)
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  {hasDiscountPrice ? (
                    <div className="price flex gap-2 items-center mb-4">
                      <h6 className="discount_price text-green-600">
                        $
                        {discountPrice.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </h6>
                      <h6 className="original_price text-gray-600 line-through!">
                        $
                        {product.price.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </h6>
                    </div>
                  ) : (
                    <h6 className="price text-gray-800 mb-4">
                      $
                      {product.price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </h6>
                  )}

                  <div className="flex flex-col items-end">
                    <span className="text-gray-400 uppercase tracking-widest">
                      SKU:
                    </span>
                    <span className="text-gray-600 bg-gray-100 px-2 py-1 rounded">
                      {product.sku}
                    </span>
                  </div>
                </div>
              </div>

              <div className="stock my-10">
                <span
                  className={`text-gray-600 ${product.isAvailable && product.totalStockCount >= 6 ? "bg-green-200 text-green-800" : "bg-red-100 text-red-500"} px-2 py-1 rounded`}
                >
                  {product.isAvailable ? `In Stock` : "Out of Stock"}
                </span>

                {product.isAvailable && product.totalStockCount >= 6 && (
                  <span className="text-sm ml-2 text-gray-600">
                    <span className="text-green-700"></span>
                    <span className="text-green-700">
                      {product.totalStockCount}
                    </span>{" "}
                    items available
                  </span>
                )}
                {product.isAvailable && product.totalStockCount < 6 && (
                  <span className="text-sm ml-2 text-gray-600">
                    <span className="text-red-500">Hurry up!</span>only{" "}
                    <span className="text-red-500">
                      {product.totalStockCount}
                    </span>{" "}
                    item(s) available
                  </span>
                )}
              </div>

              {/* Size Selection */}
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <p className="text-xl! font-bold text-gray-900">
                    Select Size
                  </p>
                  <span className="text-sm text-blue-600 font-medium cursor-pointer hover:underline">
                    Size Guide
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-4 mt-1">
                  {product.sizes?.map((size) => (
                    <button
                      key={size.value}
                      onClick={() => setSelectedSize(size.value)}
                      disabled={size.stock === 0}
                      className={`rounded-lg border-2 transition-all px-0
                      ${
                        size.stock === 0
                          ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed!"
                          : selectedSize === size.value
                            ? "border-black bg-black text-white py-5"
                            : "border-gray-200 text-gray-900 hover:border-gray-400"
                      }
                    `}
                    >
                      {size.value}
                      {size.stock === 0 && (
                        <span className="block uppercase">Sold Out</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-10 flex gap-4">
                <button
                  onClick={addToCart}
                  disabled={isMaxedOut}
                  className={`w-full py-4 rounded-xl font-bold transition-all ${
                    isMaxedOut
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-black text-white hover:bg-gray-800"
                  }`}
                >
                  {isMaxedOut ? "Max Stock Reached" : "Add to Cart"}
                </button>
                <button className="p-4 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>

              {/* Shipping Info */}
              <div className="mt-8 border-t border-gray-100 pt-8 space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Fast shipping to your location (2-4 business days)
                </div>
                <p className="text-xs text-gray-400 italic">
                  Free returns on all orders within 30 days.
                </p>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="my-10 py-2 border-t border-b border-gray-300">
            <header className="flex gap-6">
              <button
                className={`border-b-3 ${pagination === "description" ? "border-green-900" : "border-transparent"} px-2 py-2`}
                onClick={() => setPagination("description")}
              >
                Description
              </button>
              <button
                onClick={() => setPagination("reviews")}
                className={`border-b-3 ${pagination === "reviews" ? "border-green-900" : "border-transparent"} px-2 py-2`}
              >
                Reviews ({product.reviews.length})
              </button>
            </header>
            <div className="my-4">
              {pagination === "description" && (
                <>
                  <p className="text-gray-700 leading-7">
                    {product.description}
                  </p>
                </>
              )}
              {pagination === "reviews" && (
                <>
                  <ReviewPagination />
                </>
              )}
            </div>
          </div>
        </div>
      </section>
      <BestSeller />
    </>
  );
};

export default ProductDetail;
