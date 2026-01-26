import React from "react";

const ProductPreview = ({ product, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-4xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative animate-in fade-in zoom-in duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 bg-black text-white w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
        >
          &times;
        </button>

        {/* LEFT SIDE: Image Gallery Preview */}
        <div className="md:w-1/2 bg-gray-50 flex items-center justify-center p-8">
          <div className="relative w-full aspect-square">
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
        </div>

        {/* RIGHT SIDE: Product Details */}
        <div className="md:w-1/2 p-8 md:p-12 overflow-y-auto">
          <div className="space-y-6">
            <div>
              <p className="text-sm font-bold text-green-700 uppercase tracking-widest mb-2">
                {product && product.categories?.join(" & ")}
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
                ₦{Number(product && product.price).toLocaleString()}
              </span>
              {product && product.discount > 0 && (
                <span className="text-2xl! text-gray-400 line-through!">
                  ₦
                  {(
                    product.price *
                    (1 + product.discount / 100)
                  ).toLocaleString()}
                </span>
              )}
            </div>

            <div className="border-t border-b py-6">
              <h6 className="font-bold mb-3">Select Size</h6>
              <div className="grid grid-cols-4 gap-2">
                {product &&
                  product.sizes?.map((s) => (
                    <button
                      key={s.value}
                      disabled={s.stock === 0}
                      className={`py-3 rounded-xl border-2 font-bold transition-all ${
                        s.stock > 0
                          ? "border-gray-200 hover:border-black"
                          : "bg-gray-100 text-gray-300 border-transparent cursor-not-allowed"
                      }`}
                    >
                      {s.value}
                    </button>
                  ))}
              </div>
              <p className="text-xs text-gray-500 mt-3 italic">
                * Real-time preview of available inventory.
              </p>
            </div>

            <div>
              <h6 className="font-bold mb-2">Description</h6>
              <p className="text-gray-600 leading-relaxed">
                {product && product.description}
              </p>
            </div>

            {/* Admin Action */}
            <button
              onClick={() => (window.location.href = "/admin/dashboard")}
              className="w-full bg-black text-white py-5 rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all shadow-xl active:scale-95"
            >
              Confirm & Exit Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPreview;
