import React from "react";
import PropTypes from "prop-types";
import { CheckCircle, Building2, Copy } from "lucide-react";

const OrderModal = ({ isOpen, onClose, type, total, orderId }) => {
  if (!isOpen) return null;

  const isTransfer = type === "transfer";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white px-3 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        {/* Header/Icon */}
        <div
          className={`py-4 flex flex-col items-center ${isTransfer ? "bg-slate-50" : "bg-green-50"}`}
        >
          {isTransfer ? (
            <Building2 size={40} className="text-slate-800 my-3" />
          ) : (
            <CheckCircle size={60} className="text-green-500 mb-2" />
          )}
          <h5 className="text-2xl font-black text-slate-900">
            {isTransfer ? "Final Step" : "Order Placed!"}
          </h5>
        </div>

        <div className="p-4">
          {isTransfer ? (
            <div className="space-y-4">
              <p className="text-center text-slate-600">
                To complete your order of{" "}
                <span className="font-bold! text-xl! text-slate-900">
                  $
                  {total.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
                <br></br>please transfer the exact amount to:
              </p>

              <div className="bg-slate-100 p-3 rounded-2xl border-2 border-dashed border-slate-300 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs uppercase text-slate-500 font-bold">
                    Bank Name
                  </span>
                  <span className="font-bold text-slate-800 text-sm">
                    SHUZ GLOBAL BANK
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs uppercase text-slate-500 font-bold">
                    Account Number
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900">
                      0123456789
                    </span>
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText("0123456789")
                      }
                      className="text-slate-400 hover:text-black"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs uppercase text-slate-500 font-bold">
                    Account Name
                  </span>
                  <span className="font-bold text-slate-800 text-sm">
                    SHUZ LIMITED RETAIL
                  </span>
                </div>
              </div>

              <p className="text-[10px] text-center text-slate-400 italic">
                Please use your Order ID as the transfer narration.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-xs uppercase text-slate-500 font-bold">
                  Order ID
                </span>
                <span className="font-mono font-bold text-slate-900">
                  {orderId}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-slate-600">
                Your order has been successfully logged into our system. You
                will pay <br></br>
                <span className="font-bold! text-xl! text-slate-900">
                  $
                  {total.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>{" "}
                <br></br>
                upon delivery.
              </p>
              <div className="flex flex-col justify-center items-center my-8">
                <span className="text-xs uppercase text-slate-500 font-bold">
                  Order ID
                </span>
                <span className="font-bold! text-slate-900">{orderId}</span>
              </div>
              <p className="text-sm text-slate-500">
                A confirmation email has been sent to your inbox.
              </p>
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full mt-8 bg-black text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg"
          >
            {isTransfer ? "I Have Made the Transfer" : "Continue Shopping"}
          </button>
        </div>
      </div>
    </div>
  );
};

OrderModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  total: PropTypes.number.isRequired,
  orderId: PropTypes.string.isRequired,
};

export default OrderModal;
