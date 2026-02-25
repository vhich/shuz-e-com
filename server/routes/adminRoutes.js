import express from "express";
import {
  registerSuperAdmin,
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  deleteAdminAccount,
} from "../controllers/adminController.js";
import { getAdminData } from "../controllers/adminData.js";
import { protectAdmin } from "../middleware/protectAdmin.js";
import { setSecurityHeaders } from "../middleware/securityHeader.js";
import { upload } from "../middleware/upload.js";
import { createProduct } from "../controllers/productUpload.js";
import {
  getAdminNotifications,
  markAsRead,
} from "../controllers/notificationController.js";

const router = express.Router();

// Apply security headers to ALL routes in this router
router.use(setSecurityHeaders);

// Auth Routes
router.post("/register", registerSuperAdmin);
router.post("/invite", protectAdmin, registerAdmin);
router.post("/login", loginAdmin);
router.post("/logout", protectAdmin, logoutAdmin);
router.post(
  "/add-product",
  protectAdmin,
  upload.single("image"),
  createProduct,
);

// Protected Data Routes
router.get("/me", protectAdmin, getAdminData);
// adminRoute.js
router.post("/notifications/read/:notificationId", markAsRead);
router.get("/notifications", protectAdmin, getAdminNotifications);

router.post("/account/delete", protectAdmin, deleteAdminAccount);
export default router;
