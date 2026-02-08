import express from "express";
import { updateCart, deleteFromCart } from "../controllers/cartController.js";
// Import your auth middleware to protect these routes
import authClient from "../middleware/authClient.js";

const cartRouter = express.Router();

// Use POST for both to handle data securely
cartRouter.post("/update", authClient, updateCart);
cartRouter.post("/delete", authClient, deleteFromCart);

export default cartRouter;
