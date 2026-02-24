import React, { useEffect } from "react";
import { useAppContext } from "../context/AppContent";
import {
  Bell,
  CheckCircle,
  Package,
  ShieldAlert,
  Info,
  Clock,
  ArrowLeft,
} from "lucide-react";
import AdminNavbar from "../components/AdminNavbar";
import { NavLink } from "react-router-dom";
import Notification from "../components/Notification";

const NotificationPage = () => {
  const { notifications, handleReadNotification, userData, getAdminAuthState } =
    useAppContext();

  const adminId = userData ? userData.id : null;

  const getIcon = (type) => {
    switch (type) {
      case "order":
        return <Package className="text-blue-500" size={20} />;
      case "auth":
        return <ShieldAlert className="text-red-500" size={20} />;
      default:
        return <Info className="text-slate-400" size={20} />;
    }
  };

  useEffect(() => {
    document.title = "Admin Dashboard - Notifications";
    document.body.style.overflowY = "auto"; // Ensure scrolling is enabled on this page
  }, []);
  useEffect(() => {
    const initBuyer = async () => {
      await getAdminAuthState();
    };
    initBuyer();
  }, [getAdminAuthState]);

  return (
    <>
      <AdminNavbar />
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <h6 className="text-2xl font-black text-slate-900 flex items-center gap-3">
            <Bell className="text-slate-400" /> Notifications
          </h6>
          <NavLink
            to="/admin/dashboard"
            className="text-sm! text-blue-500 hover:underline flex! items-center gap-1"
          >
            <ArrowLeft size={14} />
            Dashboard
          </NavLink>
        </div>

        <div className="space-y-3">
          {notifications && notifications.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 rounded-4xl border-2 border-dashed border-slate-200">
              <CheckCircle className="mx-auto text-slate-300 mb-4" size={40} />
              <p className="text-slate-400 font-bold">
                All caught up! No new alerts.
              </p>
            </div>
          ) : (
            notifications.map((notif) => {
              const isRead = notif.readBy.some((r) => r.adminId === adminId);

              return (
                <Notification
                  key={notif._id}
                  isRead={isRead}
                  getIcon={getIcon(notif.type)}
                  notif={notif}
                  handleReadNotification={handleReadNotification}
                />
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationPage;
