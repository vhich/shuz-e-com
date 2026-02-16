import notificationModel from "../models/notification.js";
import { createNotification } from "../utils/notificationHelper.js";

// Add this to your notificationController.js
export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const { adminId } = req.body; // Pass the logged-in admin's ID

    const notification = await notificationModel.findOneAndUpdate(
      {
        _id: notificationId,
        "readBy.adminId": { $ne: adminId }, // "Only update if adminId is NOT in the array"
      },
      {
        $push: { readBy: { adminId, readAt: new Date() } },
      },
      { new: true },
    );

    // If notification is null, it means the adminId was already there
    if (!notification) {
      const alreadyRead = await notificationModel.findById(notificationId);
      return res.json({ success: true, notification: alreadyRead });
    }

    res.json({ success: true, notification });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getAdminNotifications = async (req, res) => {
  try {
    // Fetch notifications where recipient is null (Admin alerts)
    const notifications = await notificationModel
      .find({ recipient: null })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({ success: true, notifications });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
