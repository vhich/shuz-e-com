import Order from "../models/order.js";
import clientModel from "../models/users/clients.js";
import jwt from "jsonwebtoken";

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

export const logoutClient = async (req, res) => {
  try {
    // Use setHeader to manually force the browser's hand
    res.setHeader("Set-Cookie", [
      `ShuzClientToken=; Path=/; HttpOnly; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax; ${process.env.NODE_ENV === "production" ? "Secure" : ""}`,
    ]);

    return res.json({ success: true, message: "Logged out successfully!" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
