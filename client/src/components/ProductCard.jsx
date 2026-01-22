import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContent";

const ProductCard = ({ product }) => {
  const { setProductId, productId } = useContext(AppContent);
  const navigate = useNavigate();
  const setProductIdUrl = () => {
    setProductId(product.id);
    navigate(`/product/${product.id}`);
  };

  const hasDiscountPrice = product.discount_percentage;
  const discountPrice = (
    product.price -
    (product.price * product.discount_percentage) / 100
  ).toFixed(2);
  return (
    <div
      className="p-2 border border-gray-200 bg-white rounded-lg shadow-sm flex flex-col items-center text-center hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
      onClick={setProductIdUrl}
    >
      <div className="product_img bg-gray-200 my-4">
        <img src={product.image} alt={product.name} />
      </div>
      <p className={`lg:text-xl! sm:text-sm! mb-2 hover:text-green-700`}>
        {product.name}
      </p>
      {hasDiscountPrice ? (
        <div className="price flex flex-row-reverse gap-2 items-center mb-4">
          <span className="discount_price text-red-600">${discountPrice}</span>
          <span className="original_price text-gray-600 line-through!">
            ${product.price}
          </span>
        </div>
      ) : (
        <p className="price text-gray-800 mb-4">${product.price}</p>
      )}
    </div>
  );
};

export default ProductCard;
