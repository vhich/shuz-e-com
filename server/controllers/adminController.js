import Admin from "../models/users/admin.js";
import { validateFields } from "../utils/validator.js";
import { generateToken } from "../utils/generateToken.js";
import bcrypt from "bcryptjs";
import geoip from "geoip-lite";

/**
 * @desc    Register a new admin
 * @route   POST /api/admin/register
 */
export const registerAdmin = async (req, res) => {
  try {
    const { firstName, lastName, email, password, adminKey } = req.body;

    // 1. Security Check
    if (adminKey !== process.env.ADMIN_SECRET_KEY) {
      return res.status(401).json({ message: "Invalid Admin Invite Key." });
    }

    // 2. Check existence
    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res
        .status(400)
        .json({ success: false, message: "Admin already exists." });
    }

    const validationError = validateFields({
      firstName,
      lastName,
      email,
      password,
      adminKey,
    });

    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const admin = await Admin.create({
      firstName,
      lastName,
      email,
      password,
      adminKey,
    });
    return res.status(201).json({
      success: true,
      message: "Admin created, successfully!",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Login admin
 * @route   POST /api/admin/login
 */
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    // Get IP Address (handles local and proxy IPs)
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    // Get Device/Browser info
    const device = req.headers["user-agent"];

    // Get Location from IP
    const geo = geoip.lookup(ip);
    const locationString = geo
      ? `${geo.city}, ${geo.country}`
      : "Unknown Location";

    if (!admin) {
      return res
        .status(500)
        .json({ success: false, message: "admin not found." });
    }

    if (admin) {
      const matchedPassword = await bcrypt.compare(password, admin.password);
      if (!matchedPassword) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid email or password" });
      }
      if (admin && matchedPassword) {
        if (admin.loggedIn === true) {
          return res.status(401).json({
            success: false,
            message:
              "This admin is logged in already. \n Use a different email.",
          });
        }
      }
    }

    admin.loggedIn = true;

    await admin.save();

    res.json({
      success: true,
      message: "Login successful!",
      admin: {
        _id: admin._id,
        loggedIn: admin.loggedIn,
        email: admin.email,
        token: generateToken(admin._id, res),
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Logout Admin / Clear Cookie
 * @route   POST /api/admin/logout
 * @access  Private
 */
export const logoutAdmin = async (req, res) => {
  try {
    res.cookie("ShuzAdminToken", "", {
      httpOnly: true,
      expires: new Date(0), // Sets expiration to the past to delete it immediately
      path: "/",
    });
    const admin = await Admin.findById(req.admin._id);
    if (admin) {
      admin.loggedIn = false;
      await admin.save();
    }

    res
      .status(200)
      .json({ success: true, message: "Logged out successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
