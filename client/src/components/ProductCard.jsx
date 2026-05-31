import PropTypes from "prop-types";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContent";

const ProductCard = ({ product }) => {
  const { setProductId, loading, setIsSearchOpen } = useContext(AppContent);
  const navigate = useNavigate();
  const setProductIdUrl = () => {
    setIsSearchOpen(false);
    setProductId(product?._id);
    navigate(`/product/${product?._id}`);
  };

  const hasDiscountPrice = product?.discount > 0;
  const discountPrice = (
    product?.price -
    (product?.price * product?.discount) / 100
  ).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return (
    <div
      id={product?._id}
      className="p-2 border border-gray-200 rounded-lg flex flex-col hover:bg-white hover:shadow-sm transition-all duration-300 cursor-pointer overflow-hidden relative"
      onClick={setProductIdUrl}
    >
      {hasDiscountPrice && (
        <b className="text-sm text-white bg-red-500 absolute top-6 right-4 p-1">
          {product?.discount}% off
        </b>
      )}

      <div
        className={`product_img ${loading ? "bg-gray-200" : "bg-white"} h-50 my-4 flex flex-col overflow-hidden`}
      >
        <img
          src={product?.image}
          alt={product?.name}
          className="h-full object-cover"
        />
      </div>
      {hasDiscountPrice ? (
        <div className="discount_price flex flex-wrap gap-2 items-center mb-2">
          <span className="discount_price text-red-600 font-bold!">
            ${discountPrice}
          </span>
          <span className="original_price text-gray-600 line-through! font-bold!">
            $
            {product?.price.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
      ) : (
        <span className="original_price text-gray-800 mb-2 font-bold!">
          $
          {product?.price.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      )}
      <p className="font-bold hover:text-green-700">
        {product?.name?.length > 15
          ? `${product?.name.slice(0, 15)}...`
          : product?.name}
      </p>
      <p className="mb-2 text-xs!">
        {product?.description?.length > 30
          ? `${product?.description.slice(0, 30)}...`
          : product?.description}
      </p>
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
