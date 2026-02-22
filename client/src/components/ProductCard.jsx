import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { AppContent } from "../context/AppContent";

const ProductCard = ({ product }) => {
  const { setProductId, loading, setIsSearchOpen } = useContext(AppContent);
  const navigate = useNavigate();
  const setProductIdUrl = () => {
    setIsSearchOpen(false);
    setProductId(product._id);
    navigate(`/product/${product._id}`);
  };

  const hasDiscountPrice = product.discount;
  const discountPrice = (
    product.price -
    (product.price * product.discount) / 100
  ).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return (
    <div
      id={product._id}
      className="p-2 border border-gray-200 bg-white rounded-lg shadow-sm flex flex-col items-center text-center hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden"
      onClick={setProductIdUrl}
    >
      <div
        className={`product_img ${loading ? "bg-gray-200" : "bg-white"} my-4 h-45 flex flex-col overflow-hidden`}
      >
        <img
          src={product.image}
          alt={product.name}
          className="h-full object-contain"
        />
      </div>
      <p className="lg:text-xl! sm:text-sm! mb-2 hover:text-green-700">
        {product.name.length > 10
          ? `${product.name.slice(0, 10)}...`
          : product.name}
      </p>
      {hasDiscountPrice ? (
        <div className="price flex flex-wrap gap-2 items-center mb-4">
          <span className="discount_price text-red-600">${discountPrice}</span>
          <span className="original_price text-gray-600 line-through!">
            $
            {product.price.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
      ) : (
        <p className="price text-gray-800 mb-4">
          $
          {product.price.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      )}
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    discount: PropTypes.number,
  }).isRequired,
};

export default ProductCard;
