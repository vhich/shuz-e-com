import Admin from "../models/users/admin.js";
import { validateFields } from "../utils/validator.js";
import { generateToken } from "../utils/generateToken.js";
import bcrypt from "bcryptjs";
import geoip from "geoip-lite";
import { UAParser } from "ua-parser-js";
import { createNotification } from "../utils/notificationHelper.js";
import notificationModel from "../models/notification.js";

/**
 * @desc    Register a new admin
 * @route   POST /api/admin/register
 */
export const registerSuperAdmin = async (req, res) => {
  try {
    const { firstName, lastName, username, password, superAdminKey, role } =
      req.body;
    console.log("Request Body:", req.body);

    // 1. Security Check
    if (superAdminKey !== "shuzsuperadminsecretekey20266789") {
      return res.status(401).json({ message: "Invalid Admin Invite Key." });
    }

    // 2. Check existence
    const adminExists = await Admin.findOne({ username });
    if (adminExists) {
      return res
        .status(400)
        .json({ success: false, message: "Admin already exists." });
    }

    const validationError = validateFields({
      firstName,
      lastName,
      username,
      password,
      superAdminKey,
      role,
    });

    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const admin = await Admin.create({
      firstName,
      lastName,
      username,
      password,
      superAdminKey,
      role,
    });
    return res.status(201).json({
      success: true,
      message: "Admin created, successfully!",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const registerAdmin = async (req, res) => {
  try {
    const { firstName, lastName, username, password, adminKey, role } =
      req.body;
    console.log("Request Body:", req.body);

    // 2. Check existence
    const adminExists = await Admin.findOne({ username });
    if (adminExists) {
      return res
        .status(400)
        .json({ success: false, message: "Admin already exists." });
    }
    const validationError = validateFields({
      firstName,
      lastName,
      username,
      password,
      adminKey,
    });

    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const admin = await Admin.create({
      firstName,
      lastName,
      username,
      password,
      role,
    });
    return res.status(201).json({
      success: true,
      message: "Admin added, successfully!",
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
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });

    // Get IP Address (handles local and proxy IPs)
    // const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    let ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    if (ip === "::1" || ip === "127.0.0.1") {
      ip = "Localhost";
    }

    const parser = new UAParser(req.headers["user-agent"]);
    const deviceResult = parser.getResult();

    const deviceString = `${deviceResult.browser.name} on ${deviceResult.os.name} ${deviceResult.os.version}`;

    // Get Location from IP
    const geo = geoip.lookup(ip);
    const locationString = geo
      ? `${geo.city}, ${geo.country}`
      : "Development Server";

    console.log("Request Body:", req.body);
    if (!admin) {
      return res
        .status(401)
        .json({ success: false, message: "admin not found." });
    }

    if (admin) {
      const matchedPassword = await bcrypt.compare(password, admin.password);
      if (!matchedPassword) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid username or password" });
      }
      // Log the login attempt with device and location info
    }

    // Inside your adminLogin controller after successful password check:
    await createNotification(req, {
      title: "Admin Login Detected",
      content: `Admin ${admin.username} accessed the dashboard.`,
      type: "auth",
      priority: "high",
      loginData: {
        ip: ip, // The IP logic we did earlier
        device: deviceString, // The UA-Parser logic
        location: locationString, // The GeoIP logic
      },
    });
    const token = generateToken(admin._id, res, "ShuzAdminToken");

    await admin.save();

    res.json({
      success: true,
      message: "Login successful!",
      admin: {
        username,
        token,
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
      secure: true,
      sameSite: "None",
      expires: new Date(0),
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

// 3. Delete Account
export const deleteAdminAccount = async (req, res) => {
  try {
    const adminId = req.admin;

    await Admin.findByIdAndDelete(adminId);
    res.clearCookie("ShuzAdminToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.json({ success: true, message: "Account deleted!" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
