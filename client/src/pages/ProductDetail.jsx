import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ReviewCard from "../components/ReviewCard";
import { reviews } from "../assets/asset";
import BestSeller from "../components/BestSeller";

const PRODUCT = {
  id: 1,
  name: "Air Flex Runner Z-20",
  baseSku: "SH-AFR-20",
  price: 129.99,
  discount_percentage: 15,
  description:
    "The ultimate performance running shoe designed for maximum comfort and speed. Featuring breathable mesh and carbon-fiber plates for energy return.",
  colors: ["bg-red-500", "bg-blue-500", "bg-gray-300"],
  sizes: [
    { value: "8", suffix: "08", stock: 10 },
    { value: "9", suffix: "09", stock: 4 },
    { value: "10", suffix: "10", stock: 0 },
    { value: "11", suffix: "11", stock: 7 },
  ],
  image:
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop", // High quality shoe placeholder
};

const ProductDetail = () => {
  const [selectedSize, setSelectedSize] = useState(PRODUCT.sizes[0]);
  const [pagination, setPagination] = useState("description");

  const hasDiscountPrice = PRODUCT.discount_percentage;
  const discountPrice = (
    PRODUCT.price -
    (PRODUCT.price * PRODUCT.discount_percentage) / 100
  ).toFixed(2);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, []);
  return (
    <>
      <Navbar />
      <section className="min-h-screen py-12">
        <div className="container">
          <div className="lg:grid lg:grid-cols-2 md:grid-cols-2 lg:gap-x-12 items-start">
            {/* LEFT COLUMN: Image Section */}
            <div className="w-full aspect-square static lg:sticky lg:top-8">
              <div className="img_prev h-full w-full rounded-2xl overflow-hidden bg-gray-300 flex items-center justify-center">
                <img
                  src={PRODUCT.image}
                  alt={PRODUCT.name}
                  className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* RIGHT COLUMN: Details Section */}
            <div className="mt-10 px-4 sm:px-0 lg:mt-0">
              <div className="border-b border-gray-200 pb-6">
                <nav className="flex mb-4 text-xs font-medium text-gray-500 uppercase tracking-widest">
                  <span>Footwear</span> <span className="mx-2">/</span>{" "}
                  <span>Running</span>
                </nav>
                <h4 className="text-gray-900">{PRODUCT.name}</h4>
                <div className="ratings my-3">
                  <span className="text-yellow-500 text-lg!">★★★★☆</span>
                  <span className="text-gray-500 ml-2">(2 reviews)</span>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  {hasDiscountPrice ? (
                    <div className="price flex flex-row-reverse gap-2 items-center mb-4">
                      <h6 className="discount_price text-red-600">
                        ${discountPrice}
                      </h6>
                      <h6 className="original_price text-gray-600 line-through!">
                        ${PRODUCT.price}
                      </h6>
                    </div>
                  ) : (
                    <h6 className="price text-gray-800 mb-4">
                      ${PRODUCT.price}
                    </h6>
                  )}

                  {/* Dynamic SKU Display */}
                  <div className="flex flex-col items-end">
                    <span className="text-gray-400 uppercase tracking-widest">
                      SKU:
                    </span>
                    <span className="text-gray-600 bg-gray-100 px-2 py-1 rounded">
                      {PRODUCT.baseSku}-{selectedSize.suffix}
                    </span>
                  </div>
                </div>
              </div>

              <div className="stock my-10">
                <span
                  className={`text-gray-600 ${selectedSize.stock > 0 ? "bg-green-200 text-green-800" : "bg-red-100"} px-2 py-1 rounded`}
                >
                  {selectedSize.stock > 0 ? `In Stock` : "Out of Stock"}
                </span>
                {selectedSize.stock > 0 && (
                  <span className="text-sm ml-2 text-gray-600">
                    <span className="text-green-700">Hurry up!</span> only{" "}
                    <span className="text-green-700">{selectedSize.stock}</span>{" "}
                    items available
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
                  {PRODUCT.sizes.map((size) => (
                    <button
                      key={size.value}
                      onClick={() => setSelectedSize(size)}
                      disabled={size.stock === 0}
                      className={`rounded-lg border-2 transition-all
                      ${
                        size.stock === 0
                          ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"
                          : selectedSize.value === size.value
                            ? "border-black bg-black text-white"
                            : "border-gray-200 text-gray-900 hover:border-gray-400"
                      }
                    `}
                    >
                      {size.value}
                      {size.stock === 0 && (
                        <span className="block text-[8px] uppercase">
                          Sold Out
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-10 flex gap-4">
                <button
                  disabled={selectedSize.stock === 0}
                  className="flex-1 bg-black text-white px-8 py-4 rounded-full font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {selectedSize.stock === 0 ? "Out of Stock" : "Add to Cart"}
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
                Reviews(2)
              </button>
            </header>
            <div className="my-4">
              {pagination === "description" && (
                <>
                  <p className="text-gray-700 leading-7">
                    {PRODUCT.description}
                  </p>
                  <p className="text-gray-700 leading-7">
                    Nam nec tellus a odio tincidunt auctor a ornare odio. Sed
                    non mauris vitae erat consequat auctor eu in elit. Class
                    aptent taciti sociosqu ad litora torquent per conubia
                    nostra, per inceptos himenaeos. Mauris in erat justo. Nullam
                    ac urna eu felis dapibus condimentum sit amet a augue. Sed
                    non neque elit sed.
                  </p>
                </>
              )}
              {pagination === "reviews" && (
                <>
                  <div className="reviews grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
                    <div className="order-2">
                      <h6>Add a review</h6>
                      <small className="block text-gray-600 mt-4">
                        Your email address will not be published. Required
                        fields are marked *
                      </small>
                      <select
                        name="rate"
                        id="rate"
                        className="my-4 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                      >
                        <option value="Your rating" disabled>
                          Your rating *
                        </option>
                        <option value="1">1 star</option>
                        <option value="2">2 stars</option>
                        <option value="3">3 stars</option>
                        <option value="4">4 stars</option>
                        <option value="5">5 stars</option>
                      </select>
                      <input
                        type="email"
                        name="email"
                        className="my-4 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                        placeholder="Your email*"
                      />
                      <form action="">
                        <textarea
                          className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black resize-none"
                          placeholder="Write your review here*"
                        ></textarea>
                        <button type="submit" className="mt-2 pry-btn">
                          Submit Review
                        </button>
                      </form>
                    </div>
                    <div className="flex flex-col gap-y-6">
                      {reviews.slice(0, 2).map((review, index) => (
                        <ReviewCard review={review} key={index} />
                      ))}
                    </div>
                  </div>
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
