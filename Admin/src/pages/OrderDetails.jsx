import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useSearchParams, useNavigate, NavLink } from "react-router-dom";
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  MapPin,
  User,
  CreditCard,
  Clock,
  Search,
  ArrowLeft,
} from "lucide-react";
import { toast } from "react-toastify";
import { useAppContext } from "../context/AppContent";
import Loading from "../components/Loading";

export default function OrderDetails() {
  const [searchParams] = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get("id") || "");
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [orderData, setOrderData] = useState(null);

  const { backendUrl, loading, setLoading, isLoggedIn } = useAppContext();

  const steps = ["Pending", "Processing", "Shipped", "Delivered"];
  const currentStepIndex = orderData ? steps.indexOf(orderData.status) : -1;

  const navigate = useNavigate();

  useEffect(() => {
    !isLoggedIn && navigate("/");
  }, [isLoggedIn, navigate]);

  // --- LOGIC: Fetch Order ---
  const fetchStatus = useCallback(
    async (e) => {
      if (e) e.preventDefault();
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${backendUrl}/order/track?orderId=${orderId}&email=${email}`,
        );
        if (data.success) {
          setOrderData(data.order);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Order not found");
      } finally {
        setLoading(false);
      }
    },
    [backendUrl, orderId, email, setLoading],
  );

  // --- LOGIC: Cancel Order ---
  const handleCancel = async (id, customerEmail) => {
    if (!window.confirm("Are you sure you want to cancel?")) return;
    try {
      const res = await axios.post(`${backendUrl}/order/cancel/${id}`, {
        email: customerEmail,
      });
      if (res.data.success) {
        toast.success("Order Cancelled");
        setOrderData({ ...orderData, status: "Cancelled" });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    }
  };

  // Auto-search if coming from Success Page
  useEffect(() => {
    if (searchParams.get("id") && searchParams.get("email")) {
      fetchStatus();
    }
  }, [searchParams, fetchStatus]);
  useEffect(() => {
    document.title = orderData
      ? `Order #${orderData.orderId} - ${orderData.status}`
      : "Track Your Order";
    if (orderData === null) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "auto";
    }
  }, [orderData]);

  const getStatusConfig = (step) => {
    const configs = {
      Pending: { color: "bg-slate-400", icon: <Clock size={18} /> },
      Processing: { color: "bg-orange-500", icon: <Package size={18} /> },
      Shipped: { color: "bg-blue-500", icon: <Truck size={18} /> },
      Delivered: { color: "bg-green-600", icon: <CheckCircle size={18} /> },
      Cancelled: { color: "bg-red-500", icon: <XCircle size={18} /> },
    };
    return configs[step] || configs["Pending"];
  };

  return (
    <>
      <Loading />
      <div className="bg-slate-100 py-10 px-2">
        {!orderData && (
          <div className="w-full mx-auto flex justify-center mb-6">
            <NavLink
              to={"/admin/orders"}
              className={"flex! items-center gap-2 mx-auto"}
            >
              <ArrowLeft /> See Orders
            </NavLink>
          </div>
        )}

        {/* 1. SEARCH FORM (Only shows if no orderData) */}
        {!orderData ? (
          <div className="max-w-xl mx-auto bg-green-50 p-10 rounded-md shadow-xl border border-slate-100 overflow-auto">
            <h6 className="text-3xl font-black">Track Order</h6>
            <p className="text-slate-500 mb-8 font-medium">
              Enter your details to see live delivery updates.
            </p>
            <form onSubmit={fetchStatus} className="space-y-4">
              <input
                type="text"
                placeholder="Order ID"
                className="w-full px-5 py-4 bg-slate-50 border border-gray-400 rounded-md focus:ring-2 focus:ring-black outline-none transition-all"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full px-5 py-4 bg-slate-50 border border-gray-400 rounded-md focus:ring-2 focus:ring-black outline-none transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button className="w-full bg-black text-white py-5 rounded-2xl font-bold flex justify-center gap-2 hover:bg-slate-800 transition-all">
                <Search size={20} />{" "}
                {loading ? "Finding Order..." : "Track Now"}
              </button>
            </form>
          </div>
        ) : (
          /* 2. THE REDESIGN (The Grid Layout you requested) */
          <div className="w-auto lg:px-10 sm:px-4 md:px-8 mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <button
              onClick={() => setOrderData(null)}
              className="mb-6 flex items-center gap-2 text-slate-500 font-bold hover:text-black transition-colors"
            >
              <ArrowLeft size={18} /> Go to search
            </button>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 pt-6">
              <div>
                <h6 className="text-3xl font-black text-slate-900">
                  Order Details
                </h6>
                <p className="text-slate-500 font-medium! text-3xl! my-6">
                  ID: #{orderData.orderId}
                </p>
              </div>
              {orderData.status === "Pending" && (
                <button
                  onClick={() =>
                    handleCancel(
                      orderData.orderId,
                      orderData.customerDetails.email,
                    )
                  }
                  className="px-6 py-3 bg-red-500 text-red-100 font-bold rounded-2xl hover:bg-red-400 transition-all flex items-center gap-2"
                >
                  <XCircle size={18} /> Cancel Order
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* LEFT SIDE: Progress & Items */}
              <div className="lg:col-span-8 space-y-6">
                {/* Progress Card */}
                <div className="bg-white lg:p-8 p-3 rounded-4xl shadow-sm border border-slate-100">
                  <div className="flex items-center mb-12 gap-6 flex-wrap">
                    <h6>Delivery Status</h6>
                    <span
                      className={`inline-flex! ${orderData.paymentStatus.toLowerCase() === "paid" ? "bg-green-100 text-green-500" : "bg-red-100 text-red-500"} py-1 px-3`}
                    >
                      {orderData.paymentStatus}
                    </span>
                  </div>

                  {orderData.status === "Cancelled" ? (
                    <div className="p-4 bg-red-50 rounded-2xl text-red-700 font-bold flex gap-3">
                      <XCircle /> Order Cancelled
                    </div>
                  ) : (
                    <div className="relative flex justify-between items-center px-2">
                      <div className="absolute top-5 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full"></div>
                      <div
                        className="absolute top-5 left-0 h-1 bg-black -translate-y-1/2 transition-all duration-1000 rounded-full"
                        style={{
                          width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
                        }}
                      ></div>
                      {steps.map((step, idx) => {
                        const { color, icon } = getStatusConfig(step);
                        const isActive = idx <= currentStepIndex;
                        return (
                          <div
                            key={step}
                            className="relative z-10 flex flex-col items-center"
                          >
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center border-4 shadow-sm transition-all duration-500 ${isActive ? `${color} border-white text-white scale-110` : "bg-white border-slate-100 text-slate-300"}`}
                            >
                              {icon}
                            </div>
                            <span
                              className={`text-[10px] font-black mt-3 uppercase tracking-wider ${isActive ? "text-black" : "text-slate-300"}`}
                            >
                              {step}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Items Card */}
                <div className="bg-white lg:p-8 p-4 rounded-4xl shadow-sm border border-slate-100">
                  <h6 className="font-bold mb-6 text-lg">Items Summary</h6>
                  <div className="space-y-4">
                    {orderData.items.map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center gap-4 p-4 rounded-2xl border border-slate-50"
                      >
                        <img
                          src={item.image}
                          className="w-12 h-12 object-cover rounded-sm bg-slate-100"
                        />
                        <div className="flex-1">
                          <p className="font-medium! text-md! text-slate-900">
                            {item.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            Size: {item.size} • Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="font-black">
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
                </div>
                {orderData.customerDetails.additionalInfo !== "" && (
                  <div className="bg-white lg:p-8 p-4 rounded-4xl shadow-sm border border-slate-100">
                    <h6 className="font-bold mb-6 text-lg">
                      Customer's Instruction
                    </h6>
                    <div className="space-y-4">
                      <p>{orderData.customerDetails.additionalInfo}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT SIDE: Shipping & Payment */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl">
                  <h6 className="text-slate-400 font-bold uppercase text-[10px] mb-8">
                    Order Details
                  </h6>
                  <div className="space-y-8">
                    <div className="flex gap-4">
                      <div className="bg-white/10 p-3 rounded-xl">
                        <User size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-bold">
                          Recipient
                        </p>
                        <p className="font-bold">
                          {orderData.customerDetails.firstName}{" "}
                          {orderData.customerDetails.lastName}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="bg-white/10 p-3 rounded-xl">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-bold">
                          Shipping to
                        </p>
                        <p className="font-bold text-sm">
                          {orderData.customerDetails.address},{" "}
                          {orderData.customerDetails.city}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="bg-white/10 p-3 rounded-xl">
                        <CreditCard size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-bold">
                          Payment
                        </p>
                        <p className="font-bold uppercase text-sm">
                          {orderData.paymentMethod} • {orderData.paymentStatus}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-10 pt-8 border-t border-white/10 flex justify-between items-center">
                    <p className="text-slate-400 font-medium! text-xl! uppercase">
                      Total
                    </p>
                    <p className="text-xl! font-medium!">
                      $
                      {orderData.total.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
