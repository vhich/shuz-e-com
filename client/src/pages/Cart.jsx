import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import Jumbotron from "../components/Jumbotron";
import { AppContent } from "../context/AppContent";
import Reviews from "./../components/Reviews";
import BestSeller from "./../components/BestSeller";
import { assets } from "../assets/asset";

const Cart = () => {
  const { setCartItems, cartItems } = useContext(AppContent);
  const navigate = useNavigate();

  // 1. CONVERT OBJECT TO ARRAY FOR DISPLAY
  // This turns the cart object into a list we can map over
  const cartArray = Object.values(cartItems);

  // 2. Logic to update quantity
  const updateQty = (itemKey, delta) => {
    setCartItems((prev) => {
      const updatedCart = { ...prev };
      if (updatedCart[itemKey]) {
        // Find the specific size object in the product's sizes array to check stock
        const selectedSizeData = updatedCart[itemKey].sizes.find(
          (s) => s.value === updatedCart[itemKey].size,
        );
        const currentQty = updatedCart[itemKey].quantity;
        const maxStock = selectedSizeData ? selectedSizeData.stock : 99;

        // Ensure quantity stays between 1 and the available stock
        const newQty = Math.max(1, currentQty + delta);

        if (newQty <= maxStock) {
          updatedCart[itemKey].quantity = newQty;
        }
      }
      return updatedCart;
    });
  };

  // 3. Logic to remove item
  const removeItem = (itemKey) => {
    setCartItems((prev) => {
      const updatedCart = { ...prev };
      delete updatedCart[itemKey];
      return updatedCart;
    });
  };

  // 4. Calculations
  const subtotal = cartArray.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const shipping = 0;
  const total = subtotal + shipping;

  // Use cartArray.length for the empty check
  if (cartArray.length === 0) {
    return (
      <>
        <Jumbotron text={"Cart"} />
        <div className="py-15 flex flex-col items-center justify-center p-4">
          <ShoppingBag size={40} className="text-gray-500 mb-4" />
          <h6 className="text-2xl font-bold text-gray-800">
            Your cart is empty
          </h6>
          <button onClick={() => navigate("/shop")} className="mt-6! pry-btn">
            Shop now
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="bg-gray-50 pb-10">
        <Jumbotron text={"Cart"} />
        <div className="container mx-auto pt-10 px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* List of Items */}
            <div className="lg:col-span-2 space-y-6">
              {cartArray.map((item) => {
                // The key in the object is "productId-size"
                const itemKey = `${item._id}-${item.size}`;

                return (
                  <div
                    key={itemKey}
                    className="flex flex-row items-center gap-1 bg-white rounded-2xl shadow-sm border p-4"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 lg:w-32 lg:h-32 object-cover rounded-xl"
                    />

                    <div className="flex-1 ml-4 flex flex-col justify-between">
                      <div className="flex justify-between flex-col lg:flex-row">
                        <div>
                          <p
                            onClick={() => navigate(`/product/${item._id}`)}
                            className="font-medium! cursor-pointer hover:text-green-700 text-gray-800"
                          >
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            Size: {item.size}
                          </p>
                        </div>
                        <p className="font-bold text-gray-900">
                          $
                          {(item.price * item.quantity).toLocaleString(
                            undefined,
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            },
                          )}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center bg-gray-100 rounded-lg px-2">
                          <button
                            onClick={() => updateQty(itemKey, -1)}
                            className="p-1"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="px-4 font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQty(itemKey, 1)}
                            className="p-1"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(itemKey)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Checkout Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl px-6 py-3 shadow-xl sticky top-10">
                <h6 className="font-bold mb-6">Order Details</h6>
                <div className="space-y-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="text-gray-900 font-medium">
                      $
                      {subtotal.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-700 font-medium">Free</span>
                  </div>
                  <hr />
                  <div className="flex justify-between mt-6 text-2xl font-black text-gray-900">
                    <span>Total</span>
                    <span>
                      $
                      {total.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <button
                    onClick={() => navigate("/checkout")}
                    className="w-full! mt-8 pry-btn"
                  >
                    Checkout Now
                  </button>
                </div>
                <div className="card-icons flex justify-center items-center gap-3 mt-6">
                  <div className="border border-gray-400 rounded-sm">
                    <img src={assets.Visa} className="w-10" />
                  </div>
                  <div className="border border-gray-400 rounded-sm">
                    <img src={assets.DinersClub} className="w-10" />{" "}
                  </div>
                  <div className="border border-gray-400 rounded-sm">
                    <img src={assets.Mastercard} className="w-10" />{" "}
                  </div>
                  <div className="border border-gray-400 roundedsmd">
                    <img src={assets.Stripe} className="w-10" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BestSeller />
      <Reviews />
    </>
  );
};

export default Cart;
