import express from "express";
import {
  googleAuth,
  loginClient,
  logoutClient,
  updateProfile,
  updateProfileImage,
  deleteAccount,
} from "../controllers/clientController.js";
import jwt from "jsonwebtoken";
import clientModel from "../models/users/clients.js";
import authClient from "../middleware/authClient.js";
import { signup } from "../controllers/clientController.js";
import { upload } from "../middleware/multer.js";

const clientRouter = express.Router();

clientRouter.post("/google-auth", googleAuth);

clientRouter.post("/signup", signup);
clientRouter.post("/login", loginClient);

clientRouter.post("/logout", logoutClient);
clientRouter.get("/check-auth", async (req, res) => {
  try {
    const token = req.cookies.ShuzClientToken;
    if (!token)
      return res.json({
        success: false,
        message: "Unauthorized, no token found!",
      });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const client = await clientModel.findById(decoded.id).select("-password");

    if (!client) return res.json({ success: false, message: "User not found" });
    res.json({ success: true, message: "Logged in!", client });
  } catch (error) {
    res.json({ success: false, message: error.message });
    console.log(error);
  }
});

clientRouter.post("/update-profile", authClient, updateProfile);
clientRouter.post(
  "/update-image",
  authClient,
  upload.single("image"),
  updateProfileImage,
);
clientRouter.delete("/delete-account", authClient, deleteAccount);

export default clientRouter;
