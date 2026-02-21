import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
// import { useNavigate } from 'react-router-dom';

// StripePayment.jsx

const StripePayment = ({ amount, orderId, paymentType }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  // const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Redirects user after payment
        return_url: `${window.location.origin}/order-success/${orderId}?type=${paymentType}`,
      },
    });

    if (error) {
      // Show error to customer (e.g., card declined)
      console.error(error.message);
      alert(error.message);
    }

    setIsProcessing(false);
    toast.info("Redirecting to payment confirmation...");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <button
        type="submit"
        disabled={isProcessing || !stripe}
        className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all disabled:bg-slate-400"
      >
        {isProcessing ? "Processing..." : `Pay $${amount.toFixed(2)}`}
      </button>
    </form>
  );
};
StripePayment.propTypes = {
  amount: PropTypes.number.isRequired,
  orderId: PropTypes.string.isRequired,
  paymentType: PropTypes.string.isRequired,
};

export default StripePayment;
