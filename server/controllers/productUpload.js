import { processAndUpload } from "../middleware/upload.js";
import Product from "../models/product.js";

export const createProduct = async (req, res) => {
  try {
    const { name, sku, price, description, categories, sizes } = req.body;

    // 1. Manual Validation for incoming fields
    if (!name || !sku || !price || !description) {
      return res
        .status(400)
        .json({ success: false, message: "All text fields are required" });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Please upload an image" });
    }

    // 2. Parse and Validate Arrays
    const parsedCategories = JSON.parse(categories || "[]");
    const parsedSizes = JSON.parse(sizes || "[]");

    if (parsedCategories.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please select at least one category",
      });
    }

    // Check if total stock is provided
    const totalStock = parsedSizes.reduce(
      (acc, curr) => acc + (Number(curr.stock) || 0),
      0,
    );
    if (totalStock <= 0) {
      return res.status(400).json({
        success: false,
        message: "Total stock must be greater than 0",
      });
    }

    // 3. ONLY THEN: Process and Upload Image
    const imageUrl = await processAndUpload(req.file.buffer);

    const newProduct = new Product({
      ...req.body,
      image: imageUrl,
      categories: parsedCategories,
      sizes: parsedSizes,
      createdBy: req.admin._id,
    });

    await newProduct.save();
    res.status(201).json({
      success: true,
      message: "Product published successfully!",
      data: {
        ...req.body,
        image: imageUrl,
        categories: parsedCategories,
        sizes: parsedSizes,
        createdBy: req.admin._id,
      },
    });
  } catch (error) {
    // Handle Mongoose Unique Error (for SKU)
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ success: false, message: "This SKU already exists" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};
