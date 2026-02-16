import React, { useEffect, useState, useContext } from "react";
import { AppContent } from "../context/AppContent";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Package, ChevronRight, Clock, CheckCircle2 } from "lucide-react";
import Navbar from "../components/Navbar";

const ClientOrders = () => {
  const { backendUrl, setLoading, isLoggedIn } = useContext(AppContent);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const fetchUserOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/order/client-orders`, {
        withCredentials: true,
        headers: { "Cache-Control": "no-cache" },
      });
      if (response.data.success) {
        setOrders(response.data.orders.reverse()); // Newest first
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserOrders();
  }, [isLoggedIn]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "text-green-600 bg-green-50 border-green-100";
      case "Shipped":
        return "text-blue-600 bg-blue-50 border-blue-100";
      case "Cancelled":
        return "text-red-600 bg-red-50 border-red-100";
      default:
        return "text-amber-600 bg-amber-50 border-amber-100";
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-12 px-4">
      <Navbar />
      <div className="container">
        <div className="flex items-center gap-3 mb-8">
          <Package size={28} className="text-slate-800" />
          <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
            Order History
          </h4>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl text-center border border-slate-200">
            <p className="text-slate-500 mb-6">
              You haven&apos;t placed any orders yet.
            </p>
            <button
              onClick={() => navigate("/shop")}
              className="pry-btn w-fit mx-auto"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-2 block sm:grid grid-cols-2 gap-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Header: ID and Date */}
                <div className="bg-slate-100 px-6 py-4 flex flex-wrap justify-between items-center border-b border-slate-100 gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 tracking-widest mb-1">
                      Order ID:{" "}
                    </span>
                    <span className="font-mono font-bold text-slate-900">
                      #{order.orderId}
                    </span>
                    <p className=" text-slate-500 mt-1.5 flex items-center gap-1.5">
                      <span className="font-medium text-xs!">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                        })}
                      </span>
                      <span className="text-slate-300">|</span>
                      <span className="text-xs!">
                        {new Date(order.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </p>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full border text-xs font-bold flex items-center gap-1.5 ${getStatusColor(order.status)}`}
                  >
                    {order.status === "Delivered" ? (
                      <CheckCircle2 size={14} />
                    ) : (
                      <Clock size={14} />
                    )}
                    {order.status}
                  </div>
                </div>

                {/* Body: Items Preview */}
                <div className="p-3">
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex -space-x-3 overflow-hidden">
                      {order.items.map((item, idx) => (
                        <img
                          key={idx}
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg border-4 border-white object-cover shadow-md bg-gray-100"
                        />
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-16 h-16 rounded-lg border-2 border-white bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col md:items-end justify-center">
                      <p className="text-sm text-slate-500 mb-1">
                        Total Amount
                      </p>
                      <p className="text-xl! font-medium! text-slate-900">
                        $
                        {order.total.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer: Action Button */}
                <div className="px-6 py-4 bg-white border-t border-slate-50 flex justify-end">
                  <button
                    onClick={() =>
                      navigate(
                        `/track?id=${order.orderId}&email=${order.customerDetails.email}`,
                      )
                    }
                    className="flex items-center gap-2 text-sm! font-medium! bg-slate-900 text-white px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-colors"
                  >
                    Track Order
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientOrders;
