import mongoose from "mongoose";

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
  metadata: {
    ip: String,
    device: String,
    location: String,
  },
  // To track who has seen it
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "Admin" }],
  createdAt: { type: Date, default: Date.now },
});

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
