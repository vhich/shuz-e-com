import React, { useState, useContext, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Navbar from "../components/Navbar";
import { AppContent } from "../context/AppContent";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [currentState, setCurrentState] = useState("Login");
  const backendUrl = "http://localhost:4000"; // Update to your backend port

  const { isLoggedIn } = useContext(AppContent);

  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
    console.log(isLoggedIn);
  }, []);

  const handleGoogleSuccess = async (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);

    try {
      const res = await axios.post(
        backendUrl + "/api/client/google-auth",
        {
          name: decoded.name,
          email: decoded.email,
          image: decoded.picture,
          googleId: decoded.sub,
        },
        { withCredentials: true },
      );

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
      <div className="flex flex-col items-center w-[90%] sm:max-w-96 mx-auto gap-4 text-gray-800 border mb-10 p-8 rounded-xl shadow-lg bg-white">
        <div className="inline-flex items-center gap-2 mb-2">
          <h6 className="text-3xl font-semibold">{currentState}</h6>
        </div>
        <form className="space-y-2">
          <input
            type="email"
            className="w-full px-3 py-2 border border-gray-400 rounded"
            placeholder="Email"
          />
          <input
            type="password"
            className="w-full px-3 py-2 border border-gray-400 rounded"
            placeholder="Password"
          />

          <button className="bg-black text-white px-8 py-2 w-full rounded hover:bg-gray-800">
            {currentState === "Login" ? "Sign In" : "Sign Up"}
          </button>

          <div className="flex items-center w-full my-4">
            <hr className="flex-grow border-gray-300" />
            <span className="px-2 text-gray-400 text-xs">OR</span>
            <hr className="flex-grow border-gray-300" />
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
        </form>
      </div>
    </>
  );
};

export default Login;
