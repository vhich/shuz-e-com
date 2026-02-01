import React, { useState, useContext } from "react";
import Jumbotron from "../components/Jumbotron";
import NewArrivals from "./../components/NewArrivals";
import Newsletter from "./../components/Newsletter";
import { AppContent } from "../context/AppContent"; // Import Context
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
import { ShoppingBag } from "lucide-react";

export default function CheckoutPage() {
  const { cartItems, setCartItems, setLoading, loading, backendUrl } =
    useContext(AppContent); // Pull real cart data
  const [orderID, setOrderId] = useState();
  const cartArray = Object.values(cartItems);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    telephone: "",
    city: "",
    state: "",
    zip: "",
    additionalInfo: "",
    paymentMethod: "stripe", // Default method
  });

  const generateOrderId = () => {
    const prefix = "SHZ";
    const date = Date.now().toString().slice(-6); // Last 6 digits of timestamp
    const random = Math.random().toString(36).substring(2, 5).toUpperCase(); // 3 random characters
    return `${prefix}-${date}-${random}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Calculate real totals
  const subtotal = cartArray.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const total = subtotal; // Shipping is free as per your UI

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (formData.telephone.length < 10) {
      toast.error("Invalid Phone number");
      setLoading(false);
      return;
    }
    // 1. Generate the unique ID
    const orderId = generateOrderId();

    // 2. Prepare the payload
    const orderData = {
      orderId,
      items: Object.values(cartItems), // Convert cart object to array
      customerDetails: formData,
      total: total, // Calculated from your subtotal logic
      paymentMethod: formData.paymentMethod,
      // userId: user._id || null, // Add this if you have user auth
    };

    try {
      // 3. Send to Backend
      const response = await axios.post(`${backendUrl}/order/place`, orderData);

      if (response.data.success) {
        // 4. Handle Success
        if (formData.paymentMethod !== "stripe") {
          setOrderId(orderId); // Set for the Modal to display
          toast.success(response.data.message);
          setCartItems({}); // Empty the cart after successful order
          navigate(`/order-success/${orderId}?type=${formData.paymentMethod}`);
        } else {
          navigate("/");
        }

        // Note: We don't clear the cart yet!
        // We clear it in handleCloseModal when they click "Continue Shopping"
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Checkout Error:", error);
      alert(error.response?.data?.message || "Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  // Use cartArray.length for the empty check
  if (cartArray.length === 0) {
    return (
      <>
        <Jumbotron text={"Checkout"} />
        <div className="py-15 flex flex-col items-center justify-center p-4">
          <ShoppingBag size={40} className="text-gray-500 mb-4" />
          <h6 className="text-2xl font-bold text-gray-800">
            No item(s) to checkout
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
      <Loading />
      <Jumbotron text={"Checkout"} />
      <section className="bg-slate-50 lg:py-10 md:py-6 sm:py-4">
        <div className="container">
          {/* Main Form linked by ID to the button */}
          <form
            id="checkout-form"
            onSubmit={handleSubmit}
            className="flex flex-col lg:flex-row gap-8"
          >
            {/* Left: Shipping & Payment */}
            <div className="flex-1 space-y-6">
              {/* Billing Details */}
              <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h6 className="mb-10 text-slate-700 font-bold">
                  Billing Details
                </h6>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      onChange={handleChange}
                      className="mt-1 w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring focus:ring-gray-400 focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      onChange={handleChange}
                      className="mt-1 w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring focus:ring-gray-400 focus:outline-none transition-all"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-slate-600">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      onChange={handleChange}
                      className="mt-1 w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring focus:ring-gray-400 focus:outline-none transition-all"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-slate-600">
                      Phone number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="telephone"
                      required
                      onChange={handleChange}
                      className="mt-1 w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring focus:ring-gray-400 focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </section>

              {/* Shipping Address */}
              <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h6 className="text-xl font-bold mb-6 text-slate-700">
                  Shipping Address
                </h6>
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                  <div className="md:col-span-6">
                    <label className="block text-sm font-medium text-slate-600">
                      Street Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      required
                      onChange={handleChange}
                      className="mt-1 w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring focus:ring-gray-400 focus:outline-none transition-all"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-600">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      onChange={handleChange}
                      className="mt-1 w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring focus:ring-gray-400 focus:outline-none transition-all"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-600">
                      State <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="state"
                      required
                      onChange={handleChange}
                      className="mt-1 w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring focus:ring-gray-400 focus:outline-none transition-all"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-600">
                      Zip Code <span className="text-red-500 opacity-0">*</span>
                    </label>
                    <input
                      type="text"
                      name="zip"
                      onChange={handleChange}
                      className="mt-1 w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring focus:ring-gray-400 focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </section>
              <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="md:col-span-6">
                  <label className="block text-sm font-medium text-slate-600">
                    Additional Information
                  </label>

                  <textarea
                    name="additionalInfo"
                    id="additionalInfo"
                    onChange={handleChange}
                    className="mt-1 w-full h-40 px-4 py-2 border border-slate-300 rounded-lg focus:ring focus:ring-gray-400 focus:outline-none transition-all"
                  ></textarea>
                </div>
              </section>

              {/* Payment Method Section */}
              <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h6 className="text-xl font-bold mb-6 text-slate-700">
                  Payment Method
                </h6>
                <div className="space-y-3">
                  {[
                    { id: "stripe", label: "Credit Card (Stripe)", icon: "💳" },
                    {
                      id: "transfer",
                      label: "Direct Bank Transfer",
                      icon: "🏛️",
                    },
                    { id: "cod", label: "Cash on Delivery", icon: "🚚" },
                  ].map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${formData.paymentMethod === method.id ? "border-black bg-slate-50" : "border-slate-200"}`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={formData.paymentMethod === method.id}
                          onChange={handleChange}
                          className="w-4 h-4 accent-black"
                        />
                        <span className="font-medium text-slate-700">
                          {method.label}
                        </span>
                      </div>
                      <span className="text-xl">{method.icon}</span>
                    </label>
                  ))}
                </div>
              </section>
            </div>

            {/* Right: Sidebar Summary */}
            <div className="w-full lg:w-96">
              <div className="bg-white py-6 px-6 rounded-xl shadow-sm border border-slate-200 sticky top-8">
                <h6 className="mb-6 text-slate-800 font-bold capitalize">
                  Order Summary
                </h6>

                {/* Scrollable Item List */}
                <div className="max-h-64 pt-6 overflow-y-auto mb-6 pr-2 space-y-4 custom-scrollbar">
                  {cartArray.map((item) => (
                    <div
                      key={`${item._id}-${item.size}`}
                      className="flex items-center gap-3"
                    >
                      <div className="relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 object-cover rounded-lg border border-slate-100"
                        />
                        <span className="absolute -top-2 -right-2 bg-gray-800 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-800 line-clamp-1">
                          {item.name}
                        </p>
                        <p className="text-xs text-slate-500 uppercase">
                          Size: {item.size}
                        </p>
                      </div>
                      <p className="text-sm font-semibold">
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
                  ))}
                </div>

                <div className="space-y-3 pb-4 border-b border-slate-100">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-medium text-slate-900">
                      $
                      {subtotal.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                </div>

                <div className="pt-4 flex justify-between items-center text-xl font-black text-slate-900">
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
                  disabled={loading}
                  type="submit"
                  form="checkout-form"
                  className="w-full! pry-btn transition-colors mt-8!"
                >
                  Place Order
                </button>

                <p className="text-[10px] text-slate-400 mt-4 text-center px-4">
                  By placing an order, you agree to Shuz Terms & Conditions.
                </p>
              </div>
            </div>
          </form>
        </div>
      </section>
      <NewArrivals />
      <Newsletter />
    </>
  );
}
