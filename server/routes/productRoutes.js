import express from "express";
import Product from "../models/product.js";
import { upload } from "../middleware/upload.js";
import {
  removeAllProducts,
  removeProduct,
  updateProduct,
} from "../controllers/productUpload.js";
import { protectDeleteAll } from "../middleware/protectAdmin.js";
const productRouter = express.Router();

// Public route to get all products
productRouter.get("/shuz/products", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

productRouter.get("/shuz/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
productRouter.delete("/shuz/products/:id", removeProduct);
productRouter.delete(
  "/shuz/products/flush",
  protectDeleteAll,
  removeAllProducts,
);
productRouter.put("/update-product/:id", upload.single("image"), updateProduct);

export default productRouter;
