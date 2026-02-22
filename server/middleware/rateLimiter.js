import crypto from "crypto";
import clientModel from "../models/users/clients.js";
import Admin from "../models/users/admin.js";

// In-memory store for guest fingerprints
const guestStore = new Map();

export const rateLimiter = async (req, res, next) => {
  const User = req.user?.role === "admin" ? Admin : clientModel;
  const ip = req.ip || req.headers["x-forwarded-for"];
  const userAgent = req.headers["user-agent"] || "";

  // 1. Create a unique fingerprint for Guests (IP + Browser Info)
  const fingerprint = crypto
    .createHash("md5")
    .update(ip + userAgent)
    .digest("hex");

  // 2. Identify if user is logged in (Assuming you have auth middleware before this)
  const userId = req.user?._id;

  // --- CHECK LOGGED IN USER ---
  if (userId) {
    const user = await User.findById(userId);
    if (user?.lockUntil && user.lockUntil > Date.now()) {
      return res.status(403).json({
        success: false,
        message: "Account locked due to unusual activity.",
        retryAfter: user.lockUntil,
      });
    }
  }

  // --- CHECK GUEST FINGERPRINT ---
  const guestBlockTime = guestStore.get(fingerprint);
  if (guestBlockTime && guestBlockTime > Date.now()) {
    return res.status(429).json({
      success: false,
      message: "Too many requests. Please slow down.",
      retryAfter: guestBlockTime,
    });
  } else if (guestBlockTime) {
    guestStore.delete(fingerprint); // Clean up expired block
  }

  next();
};

/**
 * Helper to trigger a block manually (e.g., in a controller after 5 failed logins)
 */
export const triggerBlock = async (req, durationMinutes = 15) => {
  const unlockTime = Date.now() + durationMinutes * 60000;

  if (req.user?._id) {
    // Lock the actual account in DB
    await User.findByIdAndUpdate(req.user._id, { lockUntil: unlockTime });
  } else {
    // Lock the guest fingerprint in memory
    const ip = req.ip || req.headers["x-forwarded-for"];
    const userAgent = req.headers["user-agent"] || "";
    const fingerprint = crypto
      .createHash("md5")
      .update(ip + userAgent)
      .digest("hex");
    guestStore.set(fingerprint, unlockTime);
  }
  return unlockTime;
};
