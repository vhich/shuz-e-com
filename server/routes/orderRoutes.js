import express from "express";
import {
  placeOrder,
  updateStatus,
  clientCancelOrder,
  trackOrder,
  allOrders,
  updatePayment,
  clientOrders,
} from "../controllers/orderController.js";
import { protectAdmin } from "../middleware/protectAdmin.js";
import { createPaymentIntent } from "../controllers/orderController.js";
import authClient from "../middleware/authClient.js";

const orderRouter = express.Router();

// --- CLIENT / PUBLIC ROUTES ---

orderRouter.post("/place", placeOrder);

orderRouter.post("/cancel/:orderId", clientCancelOrder);
orderRouter.get("/track", trackOrder);
orderRouter.get("/client-orders", authClient, clientOrders);

// --- ADMIN ROUTES ---
orderRouter.post("/status", protectAdmin, updateStatus);
orderRouter.post("/payment-status", protectAdmin, updatePayment);
orderRouter.get("/list", allOrders);

orderRouter.post("/create-payment-intent", createPaymentIntent);

export default orderRouter;
