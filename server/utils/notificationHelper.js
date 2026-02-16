import notificationModel from "../models/notification.js";

export const createNotification = async (req, data) => {
  try {
    const notification = new notificationModel(data);
    await notification.save();

    // Get the io instance from the app object
    const io = req.app.get("socketio");

    // Send to all connected admins instantly
    io.to("admins").emit("newNotification", notification);

    return notification;
  } catch (error) {
    console.error("Notification Error:", error);
  }
};
