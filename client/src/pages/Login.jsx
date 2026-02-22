import React, { useState, useContext, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
// import axios from "axios";
import Navbar from "../components/Navbar";
import { AppContent } from "../context/AppContent";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const [currentState, setCurrentState] = useState("login");
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { isLoggedIn, backendUrl, setLoading, api } = useContext(AppContent);

  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  async function handleClientAuth(e) {
    e.preventDefault();
    const { password, confirmPassword, email, firstName, lastName } = formData;
    if (currentState === "sign up") {
      if (firstName.length < 2) {
        return setError("Please provide a valid first name");
      }
      if (lastName.length < 2) {
        return setError("Please provide a valid last name");
      }
      if (!email || !password || !confirmPassword || !firstName || !lastName) {
        return setError("All fields are required.");
      }

      if (password !== confirmPassword) {
        return setError("Passwords do not match.");
      }

      if (!isValidEmail(email) || !email.includes(".com")) {
        return setError("Please enter a valid email address.");
      }
      if (password.length < 5 || password.length > 8) {
        return setError("Password must be between 5 and 8 characters.");
      }
      try {
        const { confirmPassword, ...signupData } = formData;
        setLoading(true);
        const { data } = await api.post(
          backendUrl + "/client/signup",
          signupData,
        );

        if (data.success) {
          toast.success(data.message);
          formData.email = "";
          formData.password = "";
          formData.confirmPassword = "";
          formData.firstName = "";
          formData.lastName = "";
          setTimeout(() => {
            setCurrentState("login");
          }, 500);
        } else {
          toast.error(data.message);
        }
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
        setError(null);
      }
    }

    if (currentState === "login") {
      try {
        setLoading(true);
        const { data } = await api.post(
          backendUrl + "/client/login",
          {
            email,
            password,
          },
          { "Cache-Control": "no-cache" },
        );

        if (data.success) {
          toast.success(data.message);
          window.location.href = "/";
        } else {
          toast.error(data.message);
        }
      } catch (err) {
        toast.error(err?.response?.data?.message);
      } finally {
        setLoading(false);
        setError(null);
      }
    }
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);

    try {
      const res = await api.post(backendUrl + "/client/google-auth", {
        name: decoded.name,
        email: decoded.email,
        image: decoded.picture,
        googleId: decoded.sub,
      });

      if (res.data.success) {
        window.location.href = "/"; // Redirect on success
      }
    } catch (err) {
      console.error("Auth Failed", err);
    }
  };

  return (
    <>
      <Navbar />
      <div
        className={`flex flex-col items-center w-[90%] sm:max-w-96 ${currentState !== "login" && "sm:max-w-xl "} mx-auto gap-4 text-gray-800 mb-10 p-6 rounded-xl shadow-lg bg-white`}
      >
        <p
          className={`py-0.5 px-2 ${error !== null ? "bg-red-100 text-red-500 block mb-6" : "hidden"}`}
        >
          {error}
        </p>
        <div className="inline-flex items-center gap-2 mb-2">
          <h6 className="text-3xl font-semibold capitalize!">{currentState}</h6>
        </div>
        <form className="space-y-3 my-3" onSubmit={(e) => handleClientAuth(e)}>
          {currentState === "sign up" && (
            <div className="flex flex-wrap w-full gap-3">
              <input
                value={formData.firstName.trim()}
                onChange={handleChange}
                name="firstName"
                type="text"
                className="flex-1 px-3 py-2 border border-gray-400 rounded focus:ring focus:ring-gray-400"
                placeholder="First name"
              />
              <input
                value={formData.lastName.trim()}
                onChange={handleChange}
                name="lastName"
                type="text"
                className="flex-1 px-3 py-2 border border-gray-400 rounded focus:ring focus:ring-gray-400"
                placeholder="other name"
              />
            </div>
          )}
          <input
            value={formData.email.trim()}
            onChange={handleChange}
            name="email"
            type="email"
            className="w-full px-3 py-2 border border-gray-400 rounded focus:ring focus:ring-gray-400"
            placeholder="Email"
          />
          <input
            value={formData.password.trim()}
            onChange={handleChange}
            name="password"
            type="password"
            className="w-full px-3 py-2 border border-gray-400 rounded focus:ring focus:ring-gray-400"
            placeholder="Password"
          />
          {currentState === "sign up" && (
            <input
              value={formData.confirmPassword.trim()}
              onChange={handleChange}
              name="confirmPassword"
              type="password"
              className="w-full px-3 py-2 border border-gray-400 rounded focus:ring focus:ring-gray-400"
              placeholder="Confirm password"
            />
          )}

          <button className="bg-black text-white px-8 py-2 w-full rounded hover:bg-gray-800">
            {currentState === "login" ? "Sign In" : "Sign Up"}
          </button>

          <div className="flex items-center w-full my-4">
            <hr className="grow border-gray-300" />
            <span className="px-2 text-gray-400 text-xs">OR</span>
            <hr className="grow border-gray-300" />
          </div>

          <div className="w-full flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => console.log("Login Failed")}
              theme="filled_black"
              shape="rect"
              width="320" // Fixed pixel width
            />
          </div>
          {currentState === "login" ? (
            <p className="text-center text-gray-600 text-xs! mt-4">
              Don&apos;t have and account yet?{" "}
              <span
                onClick={() => setCurrentState("sign up")}
                className="cursor-pointer text-blue-600 text-xs!"
              >
                Sign up
              </span>
            </p>
          ) : (
            <p className="text-center text-gray-600 text-xs! mt-4">
              Already have an account?{" "}
              <span
                onClick={() => setCurrentState("login")}
                className="cursor-pointer text-blue-600 text-xs!"
              >
                Sign in
              </span>
            </p>
          )}
        </form>
      </div>
    </>
  );
};

export default Login;
