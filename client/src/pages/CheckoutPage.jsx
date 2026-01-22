import React, { useState } from "react";
import Jumbotron from "../components/Jumbotron";

export default function CheckoutPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Order Data:", formData);
    alert("Order submitted!");
  };

  return (
    <>
      <Jumbotron text={"Checkout"} />
      <section className="bg-slate-50 lg:py-10 md:py-6 sm:py-4">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Form Area */}
            <div className="flex-1">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Section */}
                <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <h6 className="mb-10 text-slate-700">Billing Details</h6>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-600">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        required
                        onChange={handleChange}
                        className="mt-1 w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        required
                        onChange={handleChange}
                        className="mt-1 w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-600">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        onChange={handleChange}
                        className="mt-1 w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                </section>

                {/* Shipping Section */}
                <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <h6 className="text-xl font-semibold mb-4 text-slate-700">
                    Shipping Address
                  </h6>
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                    <div className="md:col-span-6">
                      <label className="block text-sm font-medium text-slate-600">
                        Street Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        required
                        onChange={handleChange}
                        className="mt-1 w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-600">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        required
                        onChange={handleChange}
                        className="mt-1 w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-600">
                        State / Prov.
                      </label>
                      <input
                        type="text"
                        name="state"
                        required
                        onChange={handleChange}
                        className="mt-1 w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-600">
                        Zip Code
                      </label>
                      <input
                        type="text"
                        name="zip"
                        required
                        onChange={handleChange}
                        className="mt-1 w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                </section>

                <button
                  type="submit"
                  className="w-full! pry-btn transition-colors"
                >
                  Place Order
                </button>
              </form>
            </div>

            {/* Sidebar Summary */}
            <div className="w-full lg:w-96">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 sticky top-8">
                <h6 className="mb-10 text-slate-800">Order Summary</h6>
                <div className="space-y-3 pb-4 border-bottom border-slate-100">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span>$99.00</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-lg font-bold text-slate-900">
                  <span>Total</span>
                  <span>$99.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
