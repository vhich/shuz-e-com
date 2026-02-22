import Order from "../models/order.js";
import clientModel from "../models/users/clients.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken.js";
import { v2 as cloudinary } from "cloudinary";

export const googleAuth = async (req, res) => {
  try {
    const { name, email, image, googleId } = req.body;

    // 1. Find or Create Client
    let client = await clientModel.findOne({ email });

    if (!client) {
      client = new clientModel({
        name,
        email,
        image,
        googleId,
        authSource: "google",
      });
      await client.save();
    }

    // 2. Create JWT Token
    const token = jwt.sign({ id: client._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // 3. Set HTTP-only Cookie
    res.cookie("ShuzClientToken", token, {
      httpOnly: true, // Security: JS cannot access this
      secure: process.env.NODE_ENV === "production", // Use HTTPS in production
      sameSite: "Lax", // Helps with cross-site requests
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    });

    res.json({
      success: true,
      message: "Client logged in",
      client: { name: client.name, email: client.email, image: client.image },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // 1. Check if user already exists
    const existingClient = await clientModel.findOne({ email });
    if (existingClient) {
      return res.json({ success: false, message: "User already exists" });
    }

    // 2. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create new client
    const newClient = new clientModel({
      name: `${firstName}${" "}${lastName}`,
      email,
      password: hashedPassword,
    });

    await newClient.save();

    res.json({ success: true, message: "Account created successfully!" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
export const loginClient = async (req, res) => {
  try {
    const { email, password } = req.body;
    const client = await clientModel.findOne({ email });
    if (!client) {
      return res
        .status(404)
        .json({ success: false, message: "Sorry! User not found." });
    }
    if (client) {
      const matchedPassword = await bcrypt.compare(password, client.password);
      if (!matchedPassword) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid email or password" });
      }
    }
    const token = generateToken(client._id, res, "ShuzClientToken");
    await client.save();

    res.json({
      success: true,
      message: "Login successful!",
      client: {
        _id: client._id,
        email: client.email,
        token,
      },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const logoutClient = async (req, res) => {
  try {
    res.cookie("ShuzClientToken", "", {
      httpOnly: true,
      secure: true, // Must match login
      sameSite: "None", // Must match login
      expires: new Date(0),
      path: "/",
    });

    return res.json({ success: true, message: "Logged out successfully!" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// client info controllers
// 1. Update Profile Data (Name, Address, Phone)
export const updateProfile = async (req, res) => {
  try {
    const clientId = req.clientId;
    let updates = req.body;

    const client = await clientModel.findById(clientId);
    if (!client) return res.json({ success: false, message: "User not found" });

    // SECURITY: Prevent Google users from changing Name/Email
    if (client.authSource === "google") {
      delete updates.name;
      delete updates.email;
    }

    const updatedClient = await clientModel
      .findByIdAndUpdate(
        clientId,
        { $set: updates },
        { new: true, runValidators: true },
      )
      .select("-password");

    res.json({
      success: true,
      user: updatedClient,
      message: "Profile updated!",
    });
  } catch (error) {
    console.log(error);

    res.json({ success: false, message: error.message });
  }
};

// 2. Update Profile Image (Cloudinary)
export const updateProfileImage = async (req, res) => {
  try {
    const clientId = req.clientId;
    if (!req.file)
      return res.json({ success: false, message: "No image provided" });

    const image = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "image",
      folder: "shuz_profiles",
    });

    const updatedClient = await clientModel
      .findByIdAndUpdate(clientId, { image: image.secure_url }, { new: true })
      .select("-password");

    res.json({ success: true, user: updatedClient });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// 3. Delete Account
export const deleteAccount = async (req, res) => {
  try {
    const { clientId } = req;
    await clientModel.findByIdAndDelete(clientId);

    res.clearCookie("ShuzClientToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.json({ success: true, message: "Account deleted." });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
