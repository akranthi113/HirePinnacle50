import React from "react";
import { Bell } from "lucide-react";

const NotificationBadge = ({ count }) => {
  if (count === 0) {
    return (
      <div className="flex items-center text-slate-400 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold select-none">
        <Bell className="w-4 h-4 mr-1.5" />
        <span>No new profiles</span>
      </div>
    );
  }

  return (
    <div className="flex items-center text-rose-800 bg-rose-50 border border-rose-100 px-3 py-1.5 rounded-lg text-xs font-bold animate-pulse">
      <Bell className="w-4 h-4 mr-1.5 text-rose-600 fill-rose-600" />
      <span>{count} New Profile{count > 1 ? "s" : ""} Pending</span>
    </div>
  );
};

export default NotificationBadge;
