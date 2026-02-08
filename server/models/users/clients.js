import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    // Optional for Google users, required for local users
    password: { type: String, default: "" },
    phoneNumber: { type: String, default: "" },

    // Profile Image from Google
    image: { type: String, default: "" },

    // Auth Tracking
    authSource: { type: String, default: "local" }, // "local" or "google"
    googleId: { type: String }, // The 'sub' field from Google's JWT

    // Address Object (Nested for better organization)
    address: {
      street: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      zipCode: { type: String, default: "" },
      country: { type: String, default: "" },
    },

    // Store cart items directly on the user for cross-device syncing
    cartData: { type: Object, default: {} },

    // Helpful for admin tracking
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true, minimize: false },
);

const clientModel =
  mongoose.models.client || mongoose.model("client", clientSchema);
export default clientModel;
