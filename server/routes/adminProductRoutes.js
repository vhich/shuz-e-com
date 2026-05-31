import express from "express";
import {
  removeAllProducts,
  removeProduct,
  updateProduct,
} from "../controllers/productUpload.js";
import { protectDeleteAll } from "../middleware/protectAdmin.js";
import { upload } from "../middleware/upload.js";
import Product from "../models/product.js";
import Reviews from "../models/reviews.js";
const adminAllProductRouter = express.Router();

// ========== PUBLIC ROUTE TO FETCH ALL PRODUCTS FOR ADMIN PANEL ================
adminAllProductRouter.get("/shuz/products", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
});

adminAllProductRouter.get("/shuz/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    const reviews = await Reviews.find({ productId: req.params.id }).sort({
      createdAt: -1,
    });
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, data: product, review: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
});
adminAllProductRouter.delete("/shuz/products/:id", removeProduct);
adminAllProductRouter.delete(
  "/shuz/products/flush",
  protectDeleteAll,
  removeAllProducts,
);
adminAllProductRouter.put(
  "/update-product/:id",
  upload.single("image"),
  updateProduct,
);

export default adminAllProductRouter;
