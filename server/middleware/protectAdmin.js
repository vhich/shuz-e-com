import jwt from "jsonwebtoken";
import Admin from "../models/users/admin.js";

export const protectAdmin = async (req, res, next) => {
  // 2. Get token from cookies (Ensure this name matches your generateToken file)
  const token = req.cookies.ShuzAdminToken;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized, no token found." });
  }

  try {
    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Attach admin to request, excluding password
    req.admin = await Admin.findById(decoded.id).select("-password");

    if (!req.admin) {
      return res
        .status(401)
        .json({ success: false, message: "Admin account no longer exists." });
    }

    next();
  } catch (error) {
    console.error("AUTH_ERROR:", error.message);

    // Check if error is due to expiration
    const message =
      error.name === "TokenExpiredError"
        ? "Session expired, please login again."
        : "Not authorized, token failed.";

    return res.status(401).json({ success: false, message });
  }
};

// middleware/adminAuth.js
export const protectDeleteAll = (req, res, next) => {
  const secret = req.headers["x-admin-secret"];
  const MASTER_KEY = process.env.ADMIN_DELETE_PASS_KEY;

  if (secret === MASTER_KEY) {
    next(); // Key matches, proceed to controller
  } else {
    res.status(403).json({
      success: false,
      message: "Unauthorized: Invalid Admin Secret",
    });
  }
};
