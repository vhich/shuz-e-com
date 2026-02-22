import React from "react";
import { Clock } from "lucide-react";

const Notification = ({ notif, isRead, getIcon, handleReadNotification }) => {
  const isDashboard = window.location.pathname === "/admin/dashboard";
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
          className={`p-3 rounded-xl h-fit sm:hidden md:hidden! lg:block! hidden! ${isRead ? "bg-slate-50" : "bg-white shadow-sm"}`}
        >
          {getIcon(notif.type)}
        </div>

        <div className="flex-1">
          <div className="sm:block lg:flex md:block block justify-between items-start">
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
            <div className="mt-3 sm:block lg:flex md:hidden hidden gap-4 text-slate-400 bg-slate-100/50 p-2 rounded-lg w-fit">
              <span className="text-sm!">📍 {notif.loginData.location}</span>{" "}
              <span className="text-sm!">🖥️ {notif.loginData.device}</span>
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
          {!isDashboard && (
            <button
              onClick={() => handleReadNotification(notif._id)}
              className="bottom-5 text-xs! font-bold text-blue-600 hover:text-blue-800"
            >
              Mark as Read
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Notification;
