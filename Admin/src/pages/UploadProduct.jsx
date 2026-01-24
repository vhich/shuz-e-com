import React, { useState } from "react";
import SideNav from "../components/SideNav";
import AdminNavbar from "../components/AdminNavbar";
// Import your assets here
// import { product_img1, product_img2, product_img3, product_img4, product_img5, product_img7 } from "../assets/asset";

const CATEGORIES = [
  { id: 1, name: "Running Shoes" },
  { id: 2, name: "Casual Shoes" },
  { id: 3, name: "Loafer Shoes" },
  { id: 4, name: "Sport Shoes" },
  { id: 6, name: "Basketball Shoes" },
];

const UploadProduct = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sizes, setSizes] = useState([
    { value: "8", suffix: "08", stock: 0 },
    { value: "9", suffix: "09", stock: 0 },
    { value: "10", suffix: "10", stock: 0 },
    { value: "11", suffix: "11", stock: 0 },
  ]);

  // Handlers
  const handleCategoryChange = (name) => {
    setSelectedCategories((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name],
    );
  };

  const handleStockChange = (index, val) => {
    const updated = [...sizes];
    updated[index].stock = parseInt(val) || 0;
    setSizes(updated);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <>
      <AdminNavbar />
      <main className="w-screen">
        <div className="grid lg:grid-cols-[15%_85%] sm:grid-cols-1">
          <SideNav />
          <section className="bg-gray-50 h-screen w-full overflow-y-auto py-12 px-2 md:px-10 lg:px-15">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-green-700 py-8 px-4 text-white">
                <h6>Product Management</h6>
                <p className="text-gray-200">
                  Create a new product listing in the store.
                </p>
              </div>

              <form className="py-8 px-4 md:px-8 lg:px-10 space-y-10">
                {/* PART 1: GENERAL INFO & SIZES */}
                <div className="space-y-6">
                  <h6 className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-gray-200 text-black text-xs rounded-full flex items-center justify-center">
                      01
                    </span>
                    General Details
                  </h6>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Product Name"
                      className="w-full p-3 border rounded-xl outline-none focus:border-black"
                    />
                    <input
                      type="text"
                      placeholder="Base SKU (e.g. SH-AFR)"
                      className="w-full p-3 border rounded-xl outline-none focus:border-black"
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-2 gap-2">
                    <input
                      type="number"
                      min={0}
                      placeholder="Price ($)"
                      className="w-full p-3 border rounded-xl outline-none"
                    />
                    <input
                      type="number"
                      min={0}
                      placeholder="Discount (%)"
                      className="w-full p-3 border rounded-xl outline-none"
                    />
                  </div>

                  <textarea
                    placeholder="Product Description..."
                    rows="4"
                    className="w-full p-4 border rounded-xl outline-none focus:border-black resize-none bg-gray-50"
                  ></textarea>

                  {/* Sizes Selection */}
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <p className="text-sm font-bold mb-4 uppercase tracking-wider text-gray-500">
                      Stock per Size
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {sizes.map((item, index) => (
                        <div
                          key={item.value}
                          className="bg-white p-3 rounded-lg border flex flex-col items-center"
                        >
                          <span className="text-xs font-bold mb-2">
                            Size {item.value}
                          </span>
                          <input
                            type="number"
                            value={item.stock}
                            min={0}
                            onChange={(e) =>
                              handleStockChange(index, e.target.value)
                            }
                            className="w-full text-center border-t pt-2 outline-none text-sm"
                            placeholder="Qty"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* PART 2: CATEGORY SELECT (CHECKBOXES) */}
                <div className="space-y-6">
                  <h6 className="text-lg font-bold flex items-center gap-2">
                    <span className="w-6 h-6 bg-gray-200 text-black text-xs rounded-full flex items-center justify-center">
                      02
                    </span>
                    Categories
                  </h6>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {CATEGORIES.map((cat) => (
                      <label
                        key={cat.id}
                        className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedCategories.includes(cat.name)
                            ? "border-black bg-gray-50"
                            : "border-gray-100 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="hidden"
                          onChange={() => handleCategoryChange(cat.name)}
                        />
                        <div
                          className={`w-5 h-5 rounded border flex items-center justify-center ${selectedCategories.includes(cat.name) ? "bg-black border-black" : "border-gray-300"}`}
                        >
                          {selectedCategories.includes(cat.name) && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                        <span className="text-sm font-medium">{cat.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* PART 3: MEDIA UPLOAD */}
                <div className="space-y-6">
                  <h6 className="text-lg font-bold flex items-center gap-2">
                    <span className="w-6 h-6 bg-gray-200 text-black text-xs rounded-full flex items-center justify-center">
                      03
                    </span>
                    Product Image
                  </h6>

                  <div className="relative group">
                    <div className="w-full h-64 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center bg-gray-50 transition-colors group-hover:bg-gray-100 overflow-hidden">
                      {!imagePreview ? (
                        <>
                          <svg
                            className="w-10 h-10 text-gray-400 mb-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <p className="text-sm text-gray-500 font-medium">
                            Click to browse or drag image here
                          </p>
                        </>
                      ) : (
                        <div className="relative w-full h-full">
                          <img
                            src={imagePreview}
                            className="w-full h-full object-contain p-4"
                            alt="Preview"
                          />
                          <button
                            type="button"
                            onClick={() => setImagePreview(null)}
                            className="absolute top-4 right-4 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-600 shadow-lg"
                          >
                            &times;
                          </button>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={handleImageChange}
                      />
                    </div>
                  </div>
                </div>

                <button className="w-full bg-black text-white py-5 rounded-2xl font-bold text-lg hover:bg-gray-900 transition-all shadow-xl active:scale-95">
                  Publish Product
                </button>
              </form>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default UploadProduct;
