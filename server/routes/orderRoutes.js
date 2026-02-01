import express from "express";
import {
  placeOrder,
  updateStatus,
  clientCancelOrder,
  trackOrder,
  allOrders,
} from "../controllers/orderController.js";
import { protectAdmin } from "../middleware/protectAdmin.js";

const orderRouter = express.Router();

// --- CLIENT / PUBLIC ROUTES ---

orderRouter.post("/place", placeOrder);

orderRouter.post("/cancel/:orderId", clientCancelOrder);
orderRouter.get("/track", trackOrder);

// --- ADMIN ROUTES ---

orderRouter.post("/status", protectAdmin, updateStatus);
// routes/orderRoute.js
orderRouter.get("/list", allOrders);

export default orderRouter;
