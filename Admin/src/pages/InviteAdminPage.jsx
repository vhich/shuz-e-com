import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Lock,
  ShieldCheck,
  UserPlus,
  ArrowLeft,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAppContext } from "../context/AppContent";
import Loading from "../components/Loading";

const InviteAdminPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    adminKey: "",
    role: "Admin",
  });

  const {
    handleInviteAdminCreateAccount,
    setLoading,
    setDisableForm,
    disableForm,
    inviteAdmin,
  } = useAppContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setDisableForm(true);
    handleInviteAdminCreateAccount(formData);
  };

  useEffect(() => {
    document.title = "Admin Dashboard - Invite admin";
    document.body.style.overflowY = "hidden"; // Ensure scrolling is enabled on this page
  }, []);

  return (
    <>
      <div className="h-screen overflow-y-auto bg-green-50 px-4 py-2">
        {/* Form Card */}
        <div>
          {/* Right Side: Registration Form */}
          <div className="lg:w-xl md:w-xl w-auto mx-auto">
            <div className="flex flex-wrap justify-between items-center my-8 gap-2 sm:flex-row flex-col-reverse">
              <h6 className="uppercase text-gray-900">
                {inviteAdmin ? "Add Admin" : "Create Admin Account"}
              </h6>
              <NavLink
                to="/admin/dashboard"
                className="flex! items-center gap-1 text-gray-400 hover:text-black transition-colors"
              >
                <ArrowLeft size={16} /> Dashboard
              </NavLink>
            </div>

            <form
              onSubmit={handleSubmit}
              className="relative space-y-5 bg-white shadow-2xl rounded-2xl overflow-hidden p-6"
            >
              <Loading />
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
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-gray-500 outline-none transition-all"
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
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-gray-500 outline-none transition-all"
                      placeholder="Doe"
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
                  username
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                    <Mail size={18} />
                  </span>
                  <input
                    type="text"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-gray-500 outline-none transition-all"
                    placeholder="myusername123"
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
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
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-gray-500 outline-none transition-all"
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
                    admin key
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                      <ShieldCheck size={18} />
                    </span>
                    <input
                      type="text"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-gray-500 outline-none transition-all"
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
                className={`w-full! ${disableForm ? "opacity-85" : "opacity-100"} mt-4 pry-btn flex! items-center justify-center gap-3`}
                disabled={disableForm}
              >
                <UserPlus size={18} />
                Add Admin
              </button>
            </form>

            <p className="text-center mt-8 text-sm text-gray-500">
              By adding this admin, you agree to the{" "}
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

export default InviteAdminPage;
