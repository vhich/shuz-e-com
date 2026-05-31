import express from "express";
import rateLimit from "express-rate-limit";
import validator from "validator";
import Reviews from "../models/reviews.js";

const reviewRouter = express.Router();

// 🛡️ BOT MITIGATION: Limit submissions to 5 reviews per hour per IP address
const reviewSubmitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 5,
  message: {
    error: "Too many reviews submitted from this IP. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// POST Route for Review Submission
reviewRouter.post(
  "/products/:productId/reviews",
  reviewSubmitLimiter,
  async (req, res) => {
    try {
      const { productId } = req.params;
      let { name, email, rating, comment } = req.body;

      // 1. EXISTENCE CHECK: Ensure no field is completely missing or empty
      if (!name || !email || !rating || !comment) {
        return res
          .status(400)
          .json({ success: false, error: "All fields are required." });
      }

      // 2. SANITIZATION & TRIMMING (Prevents NoSQL/SQL injections and XSS)
      // Convert inputs safely to strings and trim hidden white spaces
      name = String(name).trim();
      email = String(email).trim();
      comment = String(comment).trim();

      // 3. SECURITY & VALIDATION CHECKS

      // Name validation: Must be more than 1 character
      if (name.length < 3) {
        return res.status(400).json({
          success: false,
          error: "Name must be at least 3 characters.",
        });
      }

      // Email validation: Strict RFC email format check
      if (!validator.isEmail(email)) {
        return res.status(400).json({
          success: false,
          error: "Please provide a valid email address.",
        });
      }

      // Rating validation: Must be an integer between 1 and 5
      const parsedRating = parseInt(rating, 10);
      if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
        return res.status(400).json({
          success: false,
          error: "Rating must be a whole number between 1 and 5.",
        });
      }

      // Comment validation: Enforces your frontend constraints (between 2 and 120 characters)
      if (comment.length < 20 || comment.length > 120) {
        return res.status(400).json({
          success: false,
          error: "Comment must be between 20 and 120 characters long.",
        });
      }

      // 4. INJECTION PREVENTION
      // MongoDB/Mongoose automatically sanitizes object queries when passing strict types.
      // However, explicitly escaping HTML characters safeguards against Cross-Site Scripting (XSS).
      const sanitizedName = validator.escape(name);
      const sanitizedComment = validator.escape(comment);

      // 5. SAVE TO DATABASE
      const newReview = new Reviews({
        productId,
        name: sanitizedName,
        email,
        rating: parsedRating,
        comment: sanitizedComment,
      });

      await newReview.save();

      return res.status(201).json({
        success: true,
        message: "Review submitted!",
      });
    } catch (error) {
      console.error("System error processing review:", error);
      return res
        .status(500)
        .json({ success: false, error: "An internal server error occurred." });
    }
  },
);

export default reviewRouter;
