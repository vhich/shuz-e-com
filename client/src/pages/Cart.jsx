import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import Jumbotron from "../components/Jumbotron";
import { AppContent } from "../context/AppContent";

const Cart = () => {
  const navigate = useNavigate();

  const navigateToCheckout = () => {
    navigate(`/checkout`);
  };

  // 1. Initialize state with your products
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Premium Wireless Headphones",
      price: 299.0,
      qty: 1,
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80",
    },
    {
      id: 2,
      name: "Mechanical Keyboard",
      price: 149.0,
      qty: 1,
      image:
        "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=200&q=80",
    },
  ]);

  // 2. Logic to update quantity
  const updateQty = (id, delta) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item,
      ),
    );
  };

  // 3. Logic to remove item
  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // 4. Calculations
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0,
  );
  const shipping = 0; // Free shipping logic
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <ShoppingBag size={64} className="text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">Your cart is empty</h2>
        <button className="mt-4 text-blue-600 hover:underline">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 pb-10">
      <Jumbotron text={"Cart"} />
      <div className="container">
        <div className="mx-auto pt-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* List of Items */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-row items-center gap-1 bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 sm:p-4 p-2 transition-all hover:shadow-md"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="lg:w-32 lg:h-32 w-20 h-20 object-cover rounded-xl"
                  />

                  <div className="flex-1 sm:ml-6 mt-4 sm:mt-0 flex flex-col justify-between">
                    <div className="flex justify-between lg:flex-row flex-col">
                      <p className="font-medium! text-gray-800 lg:text-xl! sm:text-lg! text-md!">
                        {item.name}
                      </p>
                      <p className="font-bold text-gray-900">
                        ${(item.price * item.qty).toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center bg-gray-100 rounded-lg px-1">
                        <button
                          onClick={() => updateQty(item.id, -1)}
                          className="hover:bg-white rounded-md transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-4 font-semibold text-gray-700">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, 1)}
                          className=" hover:bg-white rounded-md transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Checkout Summary Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl p-4 shadow-xl border border-gray-50 sticky top-10">
                <h6 className="mb-6">Order Details</h6>
                <div className="space-y-4 text-gray-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-gray-900 font-medium">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-green-500 font-medium">Free</span>
                  </div>
                  <hr className="border-gray-100" />
                  <div className="flex justify-between text-2xl font-black text-gray-900">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                <button
                  onClick={navigateToCheckout}
                  className="w-full! mt-8 pry-btn"
                >
                  Checkout Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
