import crypto from "crypto";
import Admin from "../models/users/admin.js";
import clientModel from "../models/users/clients.js";

// Stores active block expiration timestamps
const guestStore = new Map();

// Stores active request counters: { fingerprint: { count: X, resetTime: Y } }
const requestTracker = new Map();

export const rateLimiter = async (req, res, next) => {
  const User = req.user?.role === "admin" ? Admin : clientModel;
  const ip = req.ip || req.headers["x-forwarded-for"] || "127.0.0.1";
  const userAgent = req.headers["user-agent"] || "";

  // Create a unique fingerprint for the visitor
  const fingerprint = crypto
    .createHash("md5")
    .update(ip + userAgent)
    .digest("hex");

  const userId = req.user?._id;

  // 1. CHECK IF USER IS ALREADY LOCKED OUT IN DB
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

  // 2. CHECK IF GUEST IS ALREADY BLOCKED IN MEMORY
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

  // 3. --- REQUEST TRACKING COUNTER ENGINE ---
  const currentTime = Date.now();
  const WINDOW_MS = 60000; // 1 minute window
  const MAX_REQUESTS = 10; // Maximum requests allowed in that minute
  const BLOCK_DURATION_MIN = 5; // Block them for 5 minutes if they breach it

  let record = requestTracker.get(fingerprint);

  if (!record || currentTime > record.resetTime) {
    // Start a fresh tracking window for this visitor
    record = { count: 1, resetTime: currentTime + WINDOW_MS };
    requestTracker.set(fingerprint, record);
  } else {
    // Increment existing count
    record.count += 1;

    // Check if user exceeded the maximum allowed hits
    if (record.count > MAX_REQUESTS) {
      const unlockTime = currentTime + BLOCK_DURATION_MIN * 60000;

      // Enforce the block immediately
      guestStore.set(fingerprint, unlockTime);
      requestTracker.delete(fingerprint); // Clear window tracking data

      return res.status(429).json({
        success: false,
        message: "Too many requests. Please slow down.",
        retryAfter: unlockTime,
      });
    }
  }

  next();
};

export const triggerBlock = async (req, durationMinutes = 15) => {
  const unlockTime = Date.now() + durationMinutes * 60000;
  const User = req.user?.role === "admin" ? Admin : clientModel;

  if (req.user?._id) {
    await User.findByIdAndUpdate(req.user._id, { lockUntil: unlockTime });
  } else {
    const ip = req.ip || req.headers["x-forwarded-for"] || "127.0.0.1";
    const userAgent = req.headers["user-agent"] || "";
    const fingerprint = crypto
      .createHash("md5")
      .update(ip + userAgent)
      .digest("hex");
    guestStore.set(fingerprint, unlockTime);
  }
  return unlockTime;
};
