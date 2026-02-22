import React from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiHome } from "react-icons/fi";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center">
        {/* Large "404" Background Text */}
        <div className="relative">
          <h1 className="text-[150px] md:text-[200px] font-black text-emerald-100 leading-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter">
              Lost in the Clouds?
            </h2>
          </div>
        </div>

        <p className="text-slate-500 mt-8 mb-10 text-lg max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved. Let's get
          you back on the right track.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-8 py-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 transition-all active:scale-95 shadow-sm w-full sm:w-auto"
          >
            <FiArrowLeft /> Go Back
          </button>

          <button
            onClick={() => navigate("/admin/dashboard")}
            className="flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-all active:scale-95 shadow-lg shadow-emerald-200 w-full sm:w-auto"
          >
            <FiHome /> Dashboard
          </button>
        </div>

        {/* Sneaker Graphic or Illustration Placeholder */}
        <div className="mt-16 opacity-20 grayscale">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2742/2742687.png"
            alt="Lost Sneaker"
            className="w-24 h-24 mx-auto animate-bounce"
          />
        </div>
      </div>
    </div>
  );
};

export default NotFound;
