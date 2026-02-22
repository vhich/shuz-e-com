import React, { useState, useContext, useRef } from "react";
import { AppContent } from "../context/AppContent";
// import axios from "axios";
import { toast } from "react-toastify";
import {
  User,
  MapPin,
  Phone,
  Edit2,
  Save,
  X,
  Trash2,
  AlertTriangle,
  Camera,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { assets } from "../assets/asset";
import { useEffect } from "react";

const ClientProfile = () => {
  const {
    userData,
    setUserData,
    backendUrl,
    setIsLoggedIn,
    isLoggedIn,
    setLoading,
    api,
  } = useContext(AppContent);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({ ...userData });
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const isGoogleUser = userData?.authSource === "google";

  useEffect(() => {
    setFormData({ ...userData });
  }, [userData]);
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  // Handle Image Upload
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const image = new FormData();
    image.append("image", file);
    try {
      setLoading(true);
      const response = await api.post(
        `${backendUrl}/client/update-image`,
        image,
      );
      if (response.data.success) {
        setUserData(response.data.user);
        toast.success("Photo updated!");
      }
    } catch (err) {
      toast.error("Upload failed");
      console.log(err);
    } finally {
      setLoading(false);
      setIsEditing(false);
    }
  };

  // Handle Profile Update
  const handleUpdate = async () => {
    try {
      setLoading(true);
      const { data } = await api.post(
        `${backendUrl}/client/update-profile`,
        formData,
        { withCredentials: true },
      );
      if (data.success) {
        setUserData(data.user);
        setIsEditing(false);
        toast.success("Profile updated!");
      }
    } catch (err) {
      toast.error("Update failed");
      console.log(err);
    } finally {
      setLoading(false);
      setIsEditing(false);
    }
  };

  // Handle Delete
  const handleDelete = async () => {
    try {
      setLoading(true);
      const { data } = await api.delete(`${backendUrl}/client/delete-account`, {
        withCredentials: true,
      });
      if (data.success) {
        setIsLoggedIn(false);
        setUserData(null);
        navigate("/");
        toast.warn("Account removed.");
      }
    } catch (err) {
      toast.error("Error deleting account", err);
    } finally {
      setLoading(false);
    }
  };

  if (!userData) return null;

  return (
    <>
      <Navbar />
      <div className="max-w-3xl min-w-60 mx-auto relative py-10 px-3">
        {/* <NavLink
          to={"/"}
          className={
            "flex! items-center gap-2 text-slate-600! mb-10 capitalize"
          }
        >
          <img src={assets.logo} alt="Logo" className="w-20" />
          <Home size={20} />
          Go home
        </NavLink> */}
        {/* 1. Header & Edit Toggle */}
        <div className="flex flex-wrap-reverse justify-between items-center mb-10">
          <h4 className="capitalize">
            {isEditing ? "edit profile" : "my profile"}
          </h4>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 text-sm font-bold text-blue-600 bg-blue-50 px-5 py-2.5 rounded-full hover:bg-blue-100 transition-all"
            >
              <Edit2 size={16} /> Edit Profile
            </button>
          ) : (
            <span
              className={`${isGoogleUser ? "inline-block" : "hidden"} text-[12px]! font-medium! text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full mt-2 uppercase`}
            >
              Verified Google Account
            </span>
          )}
        </div>

        {/* 2. Profile Photo Section */}
        <div
          className={`flex flex-col items-center mb-12 bg-green-200 rounded-2xl py-6 ${isEditing && isGoogleUser && "hidden"}`}
        >
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-2xl">
              <img
                src={userData.image || assets.userImg}
                className="object-cover h-full w-full"
                alt="Profile"
              />
            </div>
            {!isGoogleUser && (
              <button
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-0 right-0 bg-slate-900 text-white p-2.5 rounded-full border-2 border-white hover:scale-110 transition-transform"
              >
                <Camera size={18} />
              </button>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleImageChange(e)}
            className="hidden"
            accept="image/*"
          />
          <div className="text-center mt-4">
            <p className="text-xl! font-medium! text-slate-900">
              {userData.name}
            </p>
            <p className="font-medium text-green-800">{userData.email}</p>
            {isGoogleUser && (
              <span className="font-medium! text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full mt-2 inline-block uppercase">
                Verified Google Account
              </span>
            )}
          </div>
        </div>

        {/* 3. Fields Section */}
        <div className="space-y-8">
          <div>
            <div className="flex items-center justify-between">
              <label className="text-[12px] font-bold text-slate-600 uppercase tracking-widest ml-1 flex items-center gap-2">
                <User size={20} />
                Full Name
              </label>
              <p
                className={`text-gray-800 tracking-wide ${isEditing ? "hidden" : "block"} font-medium!`}
              >
                {userData.name}
              </p>
            </div>

            <input
              type="text"
              disabled={!isEditing || isGoogleUser}
              className={`w-full p-4 mt-1.5 rounded-2xl border bg-slate-100 transition-all font-medium focus:ring focus:ring-slate-500 ${isEditing ? "block" : "hidden"} ${isEditing && !isGoogleUser ? "border-slate-300 bg-white" : "border-transparent bg-slate-50 text-slate-700"}`}
              value={formData.name ? formData.name : userData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-[12px] font-bold text-slate-600 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Phone size={20} />
                Contact Phone
              </label>
              <p
                className={`text-gray-800 tracking-wide ${isEditing ? "hidden" : "block"} font-medium!`}
              >
                {userData.phoneNumber || "Not set"}
              </p>
            </div>
            <input
              type="text"
              disabled={!isEditing}
              placeholder={
                !isEditing && !formData.phoneNumber ? "Info not set" : "080..."
              }
              className={`w-full p-4 mt-1.5 rounded-2xl border transition-all font-medium focus:ring focus:ring-slate-500 ${isEditing ? "border-slate-300 bg-white block" : "border-transparent bg-slate-50 hidden"}`}
              value={formData.phoneNumber}
              onChange={(e) =>
                setFormData({ ...formData, phoneNumber: e.target.value })
              }
            />
          </div>

          {!isEditing && (
            <div className="border border-slate-400 rounded-2xl p-6">
              <h6 className=" text-slate-600 uppercase ml-1 mb-8 flex items-center gap-2">
                <MapPin size={25} />
                Shipping Address
              </h6>
              <div className="grid grid-cols-2 items-baseline justify-between bg-slate-100 p-2 mb-4 rounded-lg">
                <label className="text-[12px] font-bold text-slate-600 uppercase tracking-widest ml-1 flex items-center gap-2">
                  Address:
                </label>
                <p
                  className={`text-gray-800 tracking-wide ${isEditing ? "hidden" : "block"} font-medium! line-clamp-1 text-left`}
                >
                  {userData.address.street || "Not set"}
                </p>
              </div>
              <div className="grid grid-cols-2 items-baseline justify-between bg-slate-100 p-2 mb-4 rounded-lg">
                <label className="text-[12px] font-bold text-slate-600 uppercase tracking-widest ml-1 flex items-center gap-2">
                  State:
                </label>
                <p
                  className={`text-gray-800 tracking-wide ${isEditing ? "hidden" : "block"} font-medium! text-left`}
                >
                  {userData.address.state || "Not set"}
                </p>
              </div>
              <div className="grid grid-cols-2 items-baseline justify-between bg-slate-100 p-2 mb-4 rounded-lg">
                <label className="text-[12px] font-bold text-slate-600 uppercase tracking-widest ml-1 flex items-center gap-2">
                  City:
                </label>
                <p
                  className={`text-gray-800 tracking-wide ${isEditing ? "hidden" : "block"} font-medium! text-left`}
                >
                  {userData.address.city || "Not set"}
                </p>
              </div>
              <div className="grid grid-cols-2 items-baseline justify-between bg-slate-100 p-2 mb-4 rounded-lg">
                <label className="text-[12px] font-bold text-slate-600 uppercase tracking-widest ml-1 flex items-center gap-2">
                  Zipcode:
                </label>
                <p
                  className={`text-gray-800 tracking-wide ${isEditing ? "hidden" : "block"} font-medium! text-left`}
                >
                  {userData.address.zipCode || "Not set"}
                </p>
              </div>
            </div>
          )}

          <div
            className={`border border-slate-400 rounded-2xl p-6 ${!isEditing && "hidden"}`}
          >
            <h6 className=" text-slate-600 uppercase ml-1 mb-8 flex items-center gap-2">
              <MapPin size={25} /> Shipping Address
            </h6>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["street", "city", "state", "zipCode", "country"].map((f) => (
                <div key={f}>
                  <input
                    type="text"
                    disabled={!isEditing}
                    placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
                    className={`w-full p-4 rounded-2xl border transition-all font-medium focus:ring focus:ring-slate-500 ${isEditing ? "border-slate-300 bg-white" : "border-transparent bg-slate-50"}`}
                    value={formData.address?.[f] || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: { ...formData.address, [f]: e.target.value },
                      })
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="flex gap-3 my-8 flex-row-reverse">
            <button
              onClick={() => setIsEditing(false)}
              className="p-2.5 text-slate-400 hover:text-red-500 bg-slate-50 rounded-full"
            >
              <X size={20} />
            </button>
            <button
              onClick={handleUpdate}
              className="flex! items-center! gap-2 pry-btn transition-all shadow-lg shadow-slate-200"
            >
              <Save size={16} /> Save Changes
            </button>
          </div>
        )}

        {/* 4. Danger Zone */}
        {!isEditing && (
          <div className="mt-9 pt-8 border-t border-red-50 flex flex-row-reverse">
            <button
              onClick={() => setShowDeleteModal(true)}
              className="p-3.5 flex items-center gap-2 bg-red-200 text-red-700 hover:text-red-800 hover:bg-red-300 rounded-2xl transition-all"
            >
              <Trash2 size={16} />
              Delete account
            </button>
          </div>
        )}

        {/* 5. Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full text-center shadow-2xl animate-in fade-in zoom-in duration-200">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 mx-auto mb-6">
                <AlertTriangle size={32} />
              </div>
              <h5 className="text-slate-900 mb-2">Delete Account?</h5>
              <p className="text-slate-500 text-sm! mb-8 leading-relaxed">
                This action is irreversible. You will lose your order history
                and saved addresses forever.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleDelete}
                  className="w-full py-4 font-bold text-white bg-red-600 rounded-2xl hover:bg-red-700 transition-all"
                >
                  Yes, Delete Forever
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="w-full py-4 font-bold text-slate-500 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ClientProfile;
