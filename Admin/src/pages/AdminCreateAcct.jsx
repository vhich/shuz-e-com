import React, { useState } from "react";
import {
  User,
  Mail,
  Lock,
  ShieldCheck,
  UserPlus,
  ArrowLeft,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const AdminCreateAcct = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    adminKey: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Admin Registration Data:", formData);
  };

  return (
    <>
      <div className="h-screen overflow-y-auto bg-gray-50 px-4 py-2">
        {/* Form Card */}
        <div>
          {/* Right Side: Registration Form */}
          <div className="lg:w-xl md:w-xl w-auto mx-auto">
            <div className="flex justify-between items-center my-8">
              <h6 className="uppercase text-gray-900">Sign Up</h6>
              <NavLink
                to="/"
                className="flex! items-center gap-1 text-gray-400 hover:text-black transition-colors"
              >
                <ArrowLeft size={16} /> Back to Login
              </NavLink>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5 bg-white shadow-2xl rounded-2xl overflow-hidden p-6"
            >
              {/* Full Name */}
              <div className="grid grid-cols-1 lg:grid-cols-2 md::grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2">
                    First Name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                      <User size={18} />
                    </span>
                    <input
                      type="text"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-green-500 outline-none transition-all"
                      placeholder="John"
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2">
                    Last Name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                      <User size={18} />
                    </span>
                    <input
                      type="text"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-green-500 outline-none transition-all"
                      placeholder="John"
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                    <Mail size={18} />
                  </span>
                  <input
                    type="email"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-green-500 outline-none transition-all"
                    placeholder="admin@brand.com"
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Password */}
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                      <Lock size={18} />
                    </span>
                    <input
                      type="password"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-green-500 outline-none transition-all"
                      placeholder="••••••••"
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Admin Key (Role Verification) */}
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2">
                    Admin Invite Key
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                      <ShieldCheck size={18} />
                    </span>
                    <input
                      type="text"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-green-500 outline-none transition-all"
                      placeholder="KEY-1234"
                      onChange={(e) =>
                        setFormData({ ...formData, adminKey: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                className="w-full! mt-4 pry-btn flex! items-center justify-center gap-3"
              >
                <UserPlus size={18} />
                Create Admin Account
              </button>
            </form>

            <p className="text-center mt-8 text-sm text-gray-500">
              By registering, you agree to the{" "}
              <a href="#" className="underline text-black">
                Terms of Service
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminCreateAcct;
