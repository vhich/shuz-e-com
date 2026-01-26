import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters"],
    },
    sku: {
      type: String,
      required: [true, "SKU is required"],
      unique: true,
      uppercase: true, // Automatically converts SH-afr to SH-AFR
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, "Discount cannot be less than 0%"],
      max: [99, "Discount cannot be 100% or more"],
    },
    categories: {
      type: [String],
      validate: [
        (v) => Array.isArray(v) && v.length > 0,
        "Select at least one category",
      ],
    },
    sizes: [
      {
        value: { type: String, required: true },
        stock: { type: Number, required: true, min: 0 },
      },
    ],
    image: { type: String, required: [true, "Product image is required"] },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  { timestamps: true },
);

const Product = mongoose.model("Product", productSchema);
export default Product;
