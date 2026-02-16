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

const NotificationPage = () => {
  const { notifications, handleReadNotification, userData } = useAppContext();

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
            Back to Dashboard
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
                <div
                  key={notif._id}
                  className={`group relative p-5 rounded-2xl border transition-all ${
                    isRead
                      ? "bg-white border-slate-100 opacity-70 hover:opacity-100"
                      : "bg-blue-50/50 border-blue-100 shadow-sm hover:bg-blue-50"
                  }`}
                >
                  <div className="flex gap-4">
                    <div
                      className={`p-3 rounded-xl h-fit ${isRead ? "bg-slate-50" : "bg-white shadow-sm"}`}
                    >
                      {getIcon(notif.type)}
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <p
                          className={`font-medium! text-xl! ${isRead ? "text-slate-700" : "text-blue-900"}`}
                        >
                          {notif.title}
                        </p>
                        <div className="flex items-center gap-1 text-[10px] font-medium text-slate-400 uppercase tracking-tighter">
                          <Clock size={12} />
                          {new Date(notif.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <p className="text-sm! text-slate-500 mt-1 leading-relaxed">
                        {notif.content}
                      </p>

                      {/* Metadata based on type */}
                      {notif.loginData && (
                        <div className="mt-3 flex gap-4 text-slate-400 bg-slate-100/50 p-2 rounded-lg w-fit">
                          <span className="text-sm!">
                            📍 {notif.loginData.location}
                          </span>
                          <span className="text-sm!">
                            🖥️ {notif.loginData.device}
                          </span>
                        </div>
                      )}
                    </div>

                    {!isRead && (
                      <div className="absolute right-5 bottom-5">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>
                  {!isRead && (
                    <div className="flex w-full flex-row-reverse">
                      <button
                        onClick={() => handleReadNotification(notif._id)}
                        className="bottom-5 text-xs! font-bold text-blue-600 hover:text-blue-800"
                      >
                        Mark as Read
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationPage;
