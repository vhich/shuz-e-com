import React, { useState } from "react";
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAppContext } from "../context/AppContent";
import Loading from "../components/Loading";

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  //   const [formData, setFormData] = useState({ email: "", password: "" });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { handleAdminLogin, setDisableForm, disableForm, setLoading } =
    useAppContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setDisableForm(true);
    handleAdminLogin(email, password);
  };

  // const navigate = useNavigate();
  // useEffect(() => {
  //   isLoggedIn && navigate("/admin/dashboard");
  // }, [isLoggedIn, navigate]);

  return (
    <div className="h-screen overflow-y-auto flex flex-col items-center bg-[#f0f2f5] py-10">
      {/* Logo Area */}
      <div className="mb-6 flex flex-col items-center">
        <div className="w-16 h-16 bg-white shadow-sm rounded-2xl flex items-center justify-center my-4 border border-gray-100">
          <ShieldCheck size={32} className="text-green-600" />
        </div>
        <h6 className="text-xl font-bold text-gray-800">Admin Login</h6>
      </div>

      {/* Login Box */}
      <div className="relative w-full max-w-100 bg-white shadow-xl shadow-gray-200/50 rounded-lg border border-gray-200 p-8">
        <Loading />
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Email or Username
            </label>
            <div className="relative">
              <input
                type="email"
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded focus:border-green-600 focus:bg-white transition-all outline-none text-gray-700"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Password
              </label>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded focus:border-green-600 focus:bg-white transition-all outline-none text-gray-700"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center">
            <input
              id="remember"
              type="checkbox"
              className="h-4 w-4 border-gray-300 rounded cursor-pointer"
            />
            <label
              htmlFor="remember"
              className="ml-2 text-sm text-gray-600 cursor-pointer"
            >
              Remember Me
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full! pry-btn ${disableForm ? "opacity-25" : "opacity-100"}`}
            disabled={disableForm}
          >
            Log In
          </button>
        </form>
      </div>

      {/* Footer Links */}
      <div className="mt-6 flex gap-4 text-sm text-gray-500 font-medium">
        <NavLink
          to="/admin/change-password"
          className="hover:text-green-600 transition-colors"
        >
          Lost your password?
        </NavLink>
        <span>&bull;</span>
        <NavLink to="/shop" className="hover:text-green-600 transition-colors">
          Back to Site
        </NavLink>
      </div>
    </div>
  );
};

export default AdminLogin;
