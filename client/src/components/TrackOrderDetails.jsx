import React from "react";
import PropTypes from "prop-types";
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  MapPin,
  User,
  CreditCard,
  Clock,
} from "lucide-react";

function TrackOrderDetails({
  orderData,
  handleCancel,
  steps,
  currentStepIndex,
}) {
  // Color configuration for status
  const getStatusConfig = (step) => {
    const configs = {
      Pending: { color: "bg-slate-500", icon: <Clock size={18} /> },
      Processing: { color: "bg-orange-500", icon: <Package size={18} /> },
      Shipped: { color: "bg-blue-500", icon: <Truck size={18} /> },
      Delivered: { color: "bg-green-600", icon: <CheckCircle size={18} /> },
      Cancelled: { color: "bg-red-500", icon: <XCircle size={18} /> },
    };
    return configs[step] || configs["Pending"];
  };

  return (
    <div className="max-w-6xl mx-auto p-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Order Tracking</h1>
          <p className="text-slate-500 font-medium">
            ID:{" "}
            <span className="text-black font-bold">#{orderData.orderId}</span> •
            Placed {new Date(orderData.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Conditional Cancel Button */}
        {orderData.status === "Pending" && (
          <button
            onClick={() =>
              handleCancel(orderData.orderId, orderData.customerDetails.email)
            }
            className="px-6 py-3 border-2 border-red-100 text-red-600 font-bold rounded-2xl hover:bg-red-50 transition-all flex items-center gap-2"
          >
            <XCircle size={18} /> Cancel Order
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Main Details (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. Progress Card */}
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
            <h3 className="font-bold mb-10 text-lg flex items-center gap-2">
              Delivery Progress
            </h3>

            {orderData.status === "Cancelled" ? (
              <div className="flex items-center gap-4 p-4 bg-red-50 rounded-2xl text-red-700 border border-red-100">
                <XCircle className="shrink-0" />
                <p className="font-bold text-sm">
                  This order was cancelled and the items have been returned to
                  inventory.
                </p>
              </div>
            ) : (
              <div className="relative flex justify-between items-center px-2">
                {/* Background Line */}
                <div className="absolute top-5 left-0 w-full h-1.5 bg-slate-100 -translate-y-1/2 rounded-full"></div>
                {/* Progress Line */}
                <div
                  className="absolute top-5 left-0 h-1.5 bg-black -translate-y-1/2 transition-all duration-1000 rounded-full"
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
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border-4 shadow-sm
                        ${isActive ? `${color} border-white text-white scale-110` : "bg-white border-slate-100 text-slate-300"}`}
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

          {/* 2. Items List */}
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
            <h3 className="font-bold mb-6 text-lg">Order Summary</h3>
            <div className="space-y-4">
              {orderData.items.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
                >
                  <div className="w-20 h-20 bg-slate-100 rounded-xl overflow-hidden shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900">{item.name}</h4>
                    <p className="text-sm text-slate-500 font-medium">
                      Size: {item.size} • Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-black text-slate-900 text-lg">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-end">
              <p className="text-slate-500 font-bold uppercase text-xs">
                Total Amount Paid
              </p>
              <p className="text-3xl font-black">
                ${orderData.total.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Contact & Info (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Customer Details */}
          <div className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-xl">
            <h3 className="text-slate-400 font-bold uppercase text-xs mb-6 tracking-widest">
              Customer Information
            </h3>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="bg-white/10 p-3 rounded-xl h-fit">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-bold">
                    Recipient
                  </p>
                  <p className="font-bold">
                    {orderData.customerDetails.firstName}{" "}
                    {orderData.customerDetails.lastName}
                  </p>
                  <p className="text-sm text-slate-400">
                    {orderData.customerDetails.email}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-white/10 p-3 rounded-xl h-fit">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-bold">
                    Shipping Address
                  </p>
                  <p className="font-bold leading-tight">
                    {orderData.customerDetails.address}
                  </p>
                  <p className="text-sm text-slate-400">
                    {orderData.customerDetails.city},{" "}
                    {orderData.customerDetails.state}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-white/10 p-3 rounded-xl h-fit">
                  <CreditCard size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-bold">
                    Payment Method
                  </p>
                  <p className="font-bold uppercase">
                    {orderData.paymentMethod}
                  </p>
                  <p
                    className={`text-xs font-bold px-2 py-0.5 rounded-full inline-block mt-1 
                    ${orderData.paymentStatus === "Paid" ? "bg-green-500/20 text-green-400" : "bg-orange-500/20 text-orange-400"}`}
                  >
                    {orderData.paymentStatus}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 text-center">
            <p className="text-sm font-medium text-slate-500 mb-4">
              Need help with your order?
            </p>
            <button className="w-full py-4 bg-slate-100 text-black font-bold rounded-2xl hover:bg-slate-200 transition-all">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

TrackOrderDetails.propTypes = {
  orderData: PropTypes.shape({
    orderId: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    total: PropTypes.number.isRequired,
    items: PropTypes.array.isRequired,
    paymentMethod: PropTypes.string.isRequired,
    paymentStatus: PropTypes.string.isRequired,
    customerDetails: PropTypes.shape({
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
      city: PropTypes.string.isRequired,
      state: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  handleCancel: PropTypes.func.isRequired,
  steps: PropTypes.array.isRequired,
  currentStepIndex: PropTypes.number.isRequired,
};

export default TrackOrderDetails;
