import { processAndUpload } from "../middleware/upload.js";
import Product from "../models/product.js";

import { v2 as cloudinary } from "cloudinary";

// Helper to extract Public ID from a URL and delete it
const deleteFromCloudinary = async (imageUrl) => {
  try {
    if (!imageUrl) return;

    // Example URL: https://res.cloudinary.com/demo/image/upload/v1234/folder/image.jpg
    // We need: "folder/image"
    const splitUrl = imageUrl.split("/");
    const fileName = splitUrl[splitUrl.length - 1].split(".")[0]; // "image"
    const folderName = splitUrl[splitUrl.length - 2]; // "folder"
    const publicId = `${folderName}/${fileName}`;

    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary Delete Error:", error);
  }
};

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

// @desc    Delete single product
// @route   DELETE /api/shuz/products/:id
export const removeProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (product) {
      await deleteFromCloudinary(product.image);
      await Product.findByIdAndDelete(id);
      res.json({ success: true, message: "Product and Image deleted" });
    } else {
      res.json({ success: false, message: "Product not found" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// @desc    Delete ALL products
// @route   DELETE /api/shuz/products/delete-all
export const removeAllProducts = async (req, res) => {
  try {
    const allProducts = await Product.find({});
    const deletePromises = allProducts.map((product) =>
      deleteFromCloudinary(product.image),
    );
    await Promise.all(deletePromises);

    // This clears the entire collection
    await Product.deleteMany({});

    res.json({ success: true, message: "All products have been deleted" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// @desc    Update product details
// @route   PUT /api/shuz/products/:id
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const oldProduct = await Product.findById(id);

    if (req.file) {
      // 1. Delete the old image from Cloudinary
      await deleteFromCloudinary(oldProduct.image);
      // 2. Set the new image path
      updateData.image = req.file.path;
    }

    // If you are using multer, text fields are in req.body
    if (!req.body || Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No data provided for update" });
    }

    // Convert strings back to arrays
    if (typeof updateData.categories === "string") {
      updateData.categories = JSON.parse(updateData.categories);
    }
    if (typeof updateData.sizes === "string") {
      updateData.sizes = JSON.parse(updateData.sizes);
    }

    const updated = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json({ success: true, data: updated });
  } catch (error) {
    console.log(error.message || error);

    res.status(500).json({ success: false, message: error.message });
  }
};
