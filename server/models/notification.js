import mongoose from "mongoose";
const readBySchema = new mongoose.Schema(
  {
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: "admins" },
    readAt: { type: Date, default: Date.now },
  },
  { _id: false },
); // <--- This prevents the extra ID generation

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  type: {
    type: String,
    enum: ["order", "system", "alert", "auth"],
    default: "system",
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "low",
  },
  // Who is this for? (null = All Admins, id = Specific User)
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "client",
    default: null,
  },
  loginData: {
    ip: String,
    device: String,
    location: String,
  },
  orderData: {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "orders" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "clients" },
    email: String,
    paymentMethod: String,
    paymentStatus: String,
  },
  // FIX: Track exactly which Admins have read it, or if a Client has read it
  readBy: [readBySchema], // For Admin notifications
  isRead: { type: Boolean, default: false }, // For individual Client notifications

  createdAt: { type: Date, default: Date.now, expires: "30d" }, // Auto-delete after 30 days
});

const Notification = mongoose.model("notifications", notificationSchema);
export default Notification;
