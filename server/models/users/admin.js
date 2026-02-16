import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    // models/Admin.js
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [4, "Password must be at least 4 characters"],
      maxlength: [100, "Password is too long"], // Note: Hashed passwords are long, so don't set this to 8!
    },
    adminKey: { type: String, required: true },
    role: { type: String, default: "admin" },
  },
  { timestamps: true },
);

// Hashing password before saving
adminSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const Admin = mongoose.model("admins", adminSchema);
export default Admin;
