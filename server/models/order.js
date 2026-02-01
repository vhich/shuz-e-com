import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // Null for guests
    items: [
      {
        _id: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        size: { type: String, required: true },
        image: { type: String, required: true },
      },
    ],
    customerDetails: {
      firstName: String,
      lastName: String,
      email: String,
      telephone: Number,
      address: String,
      city: String,
      state: String,
      zip: String,
      additionalInfo: String,
    },
    total: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
    },
    paymentStatus: { type: String, default: "Unpaid" },
  },
  { timestamps: true },
);

const Order = mongoose.models.order || mongoose.model("order", orderSchema);
export default Order;
