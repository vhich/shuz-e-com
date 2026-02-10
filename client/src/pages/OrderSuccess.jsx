import React, { useContext, useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { CheckCircle, Building2, CreditCard } from "lucide-react";
import { AppContent } from "../context/AppContent";

export default function OrderSuccess() {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();

  const { setCartItems, setOrderSuccess, orderSuccess } =
    useContext(AppContent);

  // Get variables from URL
  const paymentType = searchParams.get("type"); // 'transfer', 'cod', or 'stripe'
  const redirectStatus = searchParams.get("redirect_status"); // Provided by Stripe after redirect

  const isTransfer = paymentType === "transfer";
  const isCOD = paymentType === "cod";

  // Logic to identify a Stripe payment success
  const isStripeSuccess =
    paymentType === "stripe" || redirectStatus === "succeeded";

  useEffect(() => {
    setOrderSuccess(false);
    if (!orderSuccess) {
      setCartItems({}); // Empty the cart after successful order
      localStorage.removeItem("shuzCart");
    }
  }, []);

  return (
    <section className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        {/* Success Header */}
        <div
          className={`py-4 flex flex-col items-center ${isTransfer ? "bg-blue-50" : "bg-green-50"}`}
        >
          {isTransfer ? (
            <Building2
              size={50}
              className="text-green-600 mb-4 animate-bounce"
            />
          ) : (
            <CheckCircle
              size={50}
              className="text-green-500 mb-4 animate-pulse"
            />
          )}
          <h5 className="text-3xl font-black text-slate-900 mb-2 text-center px-4">
            {isTransfer
              ? "One Last Step!"
              : isStripeSuccess
                ? "Payment Successful!"
                : "Order Confirmed!"}
          </h5>
          <p className="text-slate-600 font-medium">
            Order ID: <span className="text-black font-bold">#{orderId}</span>
          </p>
        </div>

        <div className="p-8 md:p-12">
          {/* Dynamic Instructions */}
          {isTransfer ? (
            <div className="space-y-6">
              <div className="bg-blue-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                <p className="text-sm text-green-800 leading-relaxed">
                  Your order is currently <strong>on hold</strong>. Please
                  complete the bank transfer below to secure your items.
                </p>
              </div>

              <div className="bg-slate-100 p-6 rounded-2xl border-2 border-dashed border-slate-300 space-y-4">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase">
                    Bank
                  </span>
                  <span className="font-bold text-slate-900">
                    SHUZ GLOBAL BANK
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase">
                    Account Number
                  </span>
                  <span className="font-mono font-bold text-slate-900">
                    0123456789
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase">
                    Name
                  </span>
                  <span className="font-bold text-slate-900">
                    SHUZ RETAIL LTD
                  </span>
                </div>
              </div>
              <p className="text-center text-xs text-slate-400 italic">
                Send a screenshot of your receipt to support@shuz.com for faster
                processing.
              </p>
            </div>
          ) : (
            <div className="space-y-6 text-center">
              <p className="text-slate-600 leading-relaxed">
                {isStripeSuccess
                  ? "Thank you! Your payment has been securely processed via Stripe. We've received your order and our team is already preparing your package."
                  : "Thank you for shopping with Shuz! We've received your order and our team is already preparing your package."}
                {isCOD &&
                  " Remember to have your cash or card ready at the time of delivery."}
              </p>

              {/* Added a small Stripe confirmation badge */}
              {isStripeSuccess && (
                <div className="flex items-center justify-center gap-2 text-green-700 bg-green-100/50 py-2 px-4 rounded-full w-fit mx-auto border border-green-200">
                  <CreditCard size={16} />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Verified Stripe Payment
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="mt-10 flex flex-col gap-3">
            <Link
              to="/shop"
              className="w-full bg-black text-white py-4 rounded-xl font-bold text-center hover:bg-slate-800 transition-all"
            >
              Continue Shopping
            </Link>
            <Link
              to={`/track?id=${orderId}`}
              className="w-full bg-slate-100 border-2 border-gray-800 text-slate-800 py-4 rounded-xl font-bold text-center hover:bg-slate-200 hover:border-gray-600 transition-all"
            >
              Track Order Status
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
