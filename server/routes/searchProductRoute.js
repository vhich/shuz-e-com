import express from "express";
import Product from "../models/product.js";

const searchProductRouter = express.Router();
searchProductRouter.get("/shuz/products/search", async (req, res) => {
  try {
    const { q } = req.query;

    // If the query is empty, return an empty array instantly
    if (!q || q.trim() === "") {
      return res.status(200).json({ success: true, data: [] });
    }

    // Escape special regex characters to avoid breaking the query strings
    const searchRegex = new RegExp(
      q.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"),
      "i",
    );

    // Search matches if 'name' OR any value in 'categories' hits the regex
    const products = await Product.find({
      $or: [{ name: searchRegex }, { categories: searchRegex }],
    })
      .select("name price categories description image _id") // Only select fields needed for ProductCard to keep payload lightweight
      .limit(10); // Don't overwhelm the modal list, show top 10 relevant items

    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message || error });
  }
});

export default searchProductRouter;
