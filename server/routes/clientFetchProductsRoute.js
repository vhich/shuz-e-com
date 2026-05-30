import express from "express";
import Product from "../models/product.js";

const clientProductRouter = express.Router()

// ================== CLIENT PRODUCT FETCHING ===================

clientProductRouter.get("/shuz/products", async (req, res) => {
  try {
    const { page, limit, category, minPrice, maxPrice, type } = req.query;

    const categories = await Product.distinct("categories");

    // -------------------------------------------------------------
    // CASE A: SPECIAL SECTIONS (New Arrivals / Best Sellers)
    // -------------------------------------------------------------
    if (type === "new-arrivals") {
      // Fetch only the 4 newest items
      const products = await Product.find().sort({ createdAt: -1 }).limit(4);
      return res.status(200).json({ success: true, data: products });
    }

    if (type === "best-sellers") {
      // Fetch only 4 items that match your bestseller metric (e.g., price >= 350)
      const products = await Product.find({ price: { $gte: 350 } }).limit(5);
      return res.status(200).json({ success: true, data: products });
    }

    // -------------------------------------------------------------
    // CASE B: DYNAMIC SHOP PAGE (With Filters & 5-Item Pagination)
    // -------------------------------------------------------------
    let query = {};

    // Apply Category Filter if selected
    if (category) {
      // Supports single string or array of categories (e.g., ?category=Casual&category=Running)
      const categoryArray = Array.isArray(category) ? category : category.split(",");
      query.categories = { $in: categoryArray }; 
    }

    // Apply Price Range Filters
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Pagination Settings (5 items per page for the shop)
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 5; 
    const skip = (pageNum - 1) * limitNum;

    // Execute query if it's a general shop/admin request
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Count total matched documents to update frontend pagination buttons accurately
    const totalProducts = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      count: products.length,
      totalPages: Math.ceil(totalProducts / limitNum),
      currentPage: pageNum,
      data: products,
      category: categories,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || error });
  }
});

export default clientProductRouter